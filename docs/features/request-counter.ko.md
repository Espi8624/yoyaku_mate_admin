# 기능 사양서: 리퀘스트 대시보드 (Request Dashboard)

본 문서는 `yoyaku_mate_admin` 본사 관리자 웹에 구현된 실시간 API 트래픽 모니터링 시스템(리퀘스트 카운터)의 기능 명세 및 시스템 사양을 설명합니다.

---

## 1. 아키텍처 다이어그램 (System Flow)

이 시스템은 API 호출 성능에 영향을 미치지 않기 위해 **비동기 인메모리 버퍼링 및 배치 저장 아키텍처**로 구성되어 있습니다.

```mermaid
flowchart TD
    Client[Client App / Web] -->|1. HTTP Request| GoServer[Go API Server]
    
    subgraph GoServer ["Go API Server (yoyaku_mate_server)"]
        Middleware[MetricsMiddleware] -->|2. 요청 위임 / 비즈니스 처리| Router[Business Router]
        Middleware -->|3. 측정 결과 로그 전달 (Latency/IP)| Tracker[RequestTracker]
        
        subgraph Tracker ["RequestTracker (In-Memory Buffer)"]
            Buffer[(Buffer Slice - Max 1000)]
        end
        
        BatchWorker[Background Batch Worker] -->|4. 5초 주기로 Flush| Buffer
    end
    
    BatchWorker -->|5. Bulk Insert| MongoDB[(MongoDB Atlas)]
    
    subgraph MongoDB ["MongoDB Atlas"]
        ReqLogs[Collection: request_logs] -->|6. 3일 경과 후 자동 영구삭제| TTL[TTL Index]
    end
    
    Admin[React Admin Web] -->|7. 5초 폴링 조회| AggQuery[API: /metrics/requests & request-logs]
    AggQuery -->|8. 데이터 집계 및 로그 조회| ReqLogs
```

---

## 2. 화면 구성 요소

### 2.1 상단 요약 카드 (Metrics Cards)
실시간 API 성능 상태를 시각화하는 세 가지 핵심 지표 카드입니다. 5초 주기로 자동 갱신(HTTP Polling)됩니다.
- **TOTAL REQUESTS (24H)**: 최근 24시간 동안 서버로 유입된 전체 HTTP API 요청 수입니다.
- **SUCCESS RATE**: 24시간 전체 요청 중 정상 응답(HTTP status code가 2xx 및 3xx대)을 돌려준 성공률(%) 지표입니다. 에러 응답(4xx/5xx)이 늘어날수록 실시간으로 성공률이 감소합니다.
- **PEAK TPS (1H)**: 최근 1시간 동안 가장 트래픽이 집중되었던 초당 최대 요청 처리량(Transactions Per Second)입니다.

### 2.2 실시간 API 리퀘스트 로그 테이블 (Latest Logs Table)
가장 최근에 발생한 50개의 API 요청 이력을 최신순으로 정렬하여 그리드로 노출합니다.
- **노출 열**: 일시(Timestamp), HTTP 메서드, API 경로, 상태 코드(Status Code), 응답 속도(Latency), 클라이언트 IP.
- **시각적 강조 기능**:
  - **오류 행 하이라이트**: 상태 코드가 400 대(Bad Request 등)인 행은 주황색 틴트, 500 대(Internal Error)인 행은 붉은색 틴트로 행 배경을 하이라이트 처리하여 장애 상황을 즉시 감지할 수 있도록 돕습니다.
  - **지연 시간 경고**: API 응답 지연 속도가 500ms 이상~1000ms 미만인 경우 주황색 볼드, 1000ms 이상인 경우 빨간색 볼드로 텍스트를 강조하여 응답 지연 구간을 추적합니다.

---

## 3. 백엔드 동작 및 수집 메커니즘 (`yoyaku_mate_server`)

### 3.1 HTTP 미들웨어 및 인메모리 버퍼링
- **글로벌 수집**: Go 백엔드 서버의 라우터 전면에 `MetricsMiddleware`를 글로벌 장착하여, 유입되는 모든 API의 응답 소요 시간 및 클라이언트 IP 정보를 즉시 가로챕니다.
- **메모리 버퍼링**: API 응답 지연을 방지하기 위해 매 요청을 DB에 동기식으로 기록하지 않고, `RequestTracker`의 메모리 버퍼(최대 1,000개 한도)에 일차적으로 담아 둡니다.

### 3.2 비동기 배치 벌크 인서트 및 스토리지 관리
- **벌크 배치 처리**: 백그라운드 고루틴 워커가 **5초 주기**로 인메모리 버퍼를 비우고, 수집된 로그를 MongoDB의 `request_logs` 컬렉션에 `InsertMany`를 통해 벌크 인서트합니다.
- **자동 디스크 용량 제어**: 무한한 로그 적재로 인한 MongoDB Atlas 스토리지 용량 고갈 및 비용 상승을 원천 차단하기 위해, `request_logs` 컬렉션의 `timestamp` 필드에 **3일(259,200초) 만료 TTL 인덱스**를 지정해 오래된 로그는 백그라운드에서 자동으로 삭제됩니다.

---

## 4. 설계 선택 이유

- **배치 저장 방식 채택**: 모든 API 요청마다 MongoDB에 즉각 동기 저장하지 않고, 5초 주기의 배치 저장 방식을 채택함.
  - **이유**: DB Write 횟수를 줄여 메인 비즈니스 API들의 응답 지연(Latency)을 최소화하기 위함임.
  - **단점**: 최대 5초간 로그가 서버 메모리에만 존재하므로, 서버 다운이나 갑작스러운 장애 발생 시 메모리에 적재된 일부 로그가 유실될 수 있음.
  - **결정**: 본 기능은 결제나 예약 정보와 같이 데이터 정합성이 필수적인 기능이 아닌 '운영 모니터링 및 트래픽 분석' 목적이므로, 이 정도의 로그 유실 가능성은 시스템 안전성과 성능 확보를 위해 허용 가능한 타당한 범위라고 판단함.

---

## 5. 향후 고도화 계획 (그래프 시각화)
- **차트 라이브러리 도입**: 추후 React 어드민(`rusui-admin`)에 `Recharts` 라이브러리를 추가 설치하여, 시간에 따른 TPS 트렌드 선 그래프(Line Chart) 및 상태 코드별 성공/실패 비율 도넛 차트(Donut Chart) 시각화 피쳐 개발 예정.

---

## 6. 관련 의사결정 문서 (ADR)
- [ADR-003: 자체 메트릭 수집 및 리퀘스트 카운터 아키텍처 채택](../decisions/ADR-003-request-counter-architecture.ko.md)
