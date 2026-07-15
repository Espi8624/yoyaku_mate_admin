# 기능 사양서: SSE 상태 모니터링 대시보드 (SSE Status Dashboard)

본 문서는 `yoyaku_mate_admin` 본사 관리자 웹에 구현된 SSE 브로커 연결 현황 모니터링 페이지의 기능 명세를 설명합니다.

> 작성일: 2026-07-15  
> 관련 문서: [구현 상세서: SSE 상태 모니터링 (Admin)](../implementation/sse-monitoring.ko.md), [구현 상세서: SSE 상태 모니터링 (서버)](../../../yoyaku_mate_server/docs/implementation/sse-monitoring.ko.md)

---

## 1. 개요 (Overview)

SSE(Server-Sent Events)는 서버 → 클라이언트 단방향 연결 방식으로, 서버가 클라이언트의 연결 해제를 즉각 감지할 수 없는 구조적 특성이 있습니다. 이로 인해 실제로는 끊어졌지만 서버에서 살아있다고 인식하는 **좀비 연결(Zombie Connection)** 이 메모리에 누적될 수 있습니다.

본 대시보드는 관리자가 두 SSE 브로커(`Broker`, `WaitingUserBroker`)의 연결 현황을 실시간으로 파악하고, 서버 Heartbeat의 좀비 제거 동작이 정상적으로 이루어지고 있는지 확인할 수 있도록 합니다.

---

## 2. 화면 구성 및 핵심 지표 (UI Metrics)

관리자 대시보드 사이드바의 **SSE Status** 메뉴에서 접근하며, **5초 주기 HTTP 폴링**으로 자동 갱신됩니다.

> SSE 모니터링 자체를 SSE로 구현하면 네트워크 단절 시 모니터링 도구 자체가 신뢰를 잃게 됩니다.
> 폴링 방식은 상태가 없어 스스로 회복하므로, 안정성 우선 대시보드에 더 적합합니다.

### 2.1 상단 헤더 (Health Badge)

* 페이지 제목(`SSE Status`) 우측에 실시간 헬스 상태 배지(`Chip`)가 표시됩니다.
  * 연결 있음: 초록색 `HEALTHY` 배지
  * 연결 없음: 회색 `IDLE` 배지

### 2.2 요약 지표 카드 (Metrics Cards)

* **TOTAL CONNECTIONS (전체 활성 연결 수)**
  * **설명**: 두 SSE 브로커의 활성 채널 수를 합산한 현재 총 연결 수입니다.
  * **반영 기준**: `store_broker.total_connections + waiting_user_broker.total_connections`

* **CONNECTION HEALTH (연결 건강 상태)**
  * **설명**: 전체 연결 수를 기준으로 브로커의 동작 상태를 표시합니다.
  * **반영 기준**: `total_connections > 0` → `HEALTHY` / `0` → `IDLE`
  * **서브 텍스트**: HEALTHY 시 "이벤트 스트림 브로드캐스트 정상 동작 중", IDLE 시 "현재 활성 SSE 연결 없음"

* **STORE BROKER (점포 대기열 브로커)**
  * **설명**: 점포 대기열 SSE(`/waiting-list/stream`)를 구독 중인 연결 현황입니다.
  * **표시 항목**:
    * `total_connections`: 현재 활성 채널 수 (대형 숫자)
    * `active_keys`: 구독 중인 점포 수
    * `avg_uptime_seconds`: 채널 평균 유지 시간 (포맷: `Xh Ym` / `Xm Ys`)

* **USER BROKER (개별 대기 고객 브로커)**
  * **설명**: 개별 대기 고객 SSE(`/waiting-list/stream-user`)를 구독 중인 연결 현황입니다.
  * **표시 항목**: STORE BROKER와 동일 구조

---

## 3. 향후 고도화 로드맵 (Roadmap)

### 3.1 2단계: 운영 편의 기능

* **피크 연결 수 (Peak Connections) 표시**
  * 서버 실행 이후 기록된 최대 동시 연결 수를 표시하여 서버 스케일링 판단 지표로 활용합니다.

* **브로커별 연결 목록 테이블 (Connection List)**
  * 현재 연결 중인 점포/사용자 키 목록과 각 연결의 유지 시간을 테이블 형태로 표시합니다.

### 3.2 3단계: 능동 제어

* **강제 연결 해제 버튼**
  * 특정 점포 또는 사용자 키에 대한 SSE 연결을 관리자가 직접 강제 종료할 수 있는 기능을 추가합니다.

---

## 관련 문서
- [구현 상세서: SSE 상태 모니터링 (Admin)](../implementation/sse-monitoring.ko.md)
- [구현 상세서: SSE 상태 모니터링 (서버)](../../../yoyaku_mate_server/docs/implementation/sse-monitoring.ko.md)
- [기능 사양서: SSE 상태 모니터링 (서버)](../../../yoyaku_mate_server/docs/features/sse-monitoring.ko.md)
