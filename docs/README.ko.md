# docs — yoyaku_mate_admin (Admin Web) 문서 인덱스

## 구조

```
docs/
├── features/           # 기능 사양 (무엇을 하는가)
├── implementation/     # 기술 구현 상세 (어떻게 구현했는가)
├── decisions/          # 기술 선택 근거 (ADR)
├── troubles/           # 트러블슈팅 / 회고 기록
└── refactoring/        # 리팩토링 기록
```

---

## Features (기능 사양)

| 문서 | 설명 |
|------|------|
| [store-approval.md](./features/store-approval.ko.md) | 점포 라이선스 심사 및 승인/거절 워크플로우 |
| [error-dashboard.ko.md](./features/error-dashboard.ko.md) | 에러 통계 및 상세 로그 추적 대시보드 UI |
| [request-counter.ko.md](./features/request-counter.ko.md) | 실시간 API 리퀘스트 요약 통계 및 상세 로그 테이블 UI |
| [active-user-dashboard.ko.md](./features/active-user-dashboard.ko.md) | 실시간 활성 사용자(동시 접속자/DAU/MAU) 모니터링 대시보드 UI |
| [sse-monitoring.ko.md](./features/sse-monitoring.ko.md) | SSE 상태(활성 연결 수, 평균 유지 시간) 및 좀비 연결 감시 모니터링 UI |
| [response-time-dashboard.ko.md](./features/response-time-dashboard.ko.md) | API 레이턴시(avg/P95/P99) 및 엔드포인트별 응답시간 모니터링 대시보드 UI |
| [audit-log.ko.md](./features/audit-log.ko.md) | 관리자 작업 감사 로그 실시간 자동 갱신 및 필터 조회 화면 UI |
| [system-metrics-dashboard.ko.md](./features/system-metrics-dashboard.ko.md) | 서버 하드웨어 리소스(CPU, Memory, Disk) 실시간 상태 모니터링 UI |

---

## Implementation (구현 상세)

| 문서 | 설명 |
|------|------|
| [architecture.md](./implementation/architecture.ko.md) | 프로젝트 구조 및 데이터 흐름 |
| [dual-env-proxy.md](./implementation/dual-env-proxy.ko.md) | Dev/Prod 이중 환경 Vite 프록시 구현 |
| [error-dashboard.ko.md](./implementation/error-dashboard.ko.md) | 에러 대시보드 백엔드 연동 및 UI 구현 상세 |
| [request-counter.ko.md](./implementation/request-counter.ko.md) | 리퀘스트 카운터 백엔드 연동 및 UI 구현 상세 |
| [active-user-tracking.ko.md](./implementation/active-user-tracking.ko.md) | 실시간 활성 사용자 트래킹 백엔드 연동 및 UI 구현 상세 |
| [sse-monitoring.ko.md](./implementation/sse-monitoring.ko.md) | SSE 상태 모니터링 대시보드 백엔드 연동 및 UI 구현 상세 |
| [response-time-dashboard.ko.md](./implementation/response-time-dashboard.ko.md) | Response Time 대시보드 React 컴포넌트, 시간 범위 탭, MUI ToggleButton 버그 수정, 색상 로직 구현 상세 |
| [audit-log.ko.md](./implementation/audit-log.ko.md) | 감사 로그 대시보드 React 컴포넌트, 액션 필터, 5초 자동 갱신 UI 구현 상세 |
| [system-metrics-dashboard.ko.md](./implementation/system-metrics-dashboard.ko.md) | 시스템 메트릭스 대시보드 백엔드 연동 및 UI 구현 상세 |

---

## Decisions (기술 결정)

| 문서 | 결정 내용 |
|------|----------|
| [ADR-001-vite-proxy.md](./decisions/ADR-001-vite-proxy.ko.md) | Vite 개발 서버 프록시 채택 이유 |
| [ADR-002-use-polling-for-error-dashboard.md](./decisions/ADR-002-use-polling-for-error-dashboard.ko.md) | 에러 대시보드 내 HTTP 폴링 방식 채택 이유 |
| [ADR-003-request-counter-architecture.md](./decisions/ADR-003-request-counter-architecture.ko.md) | 자체 메트릭 수집 및 리퀘스트 카운터 아키텍처 채택 이유 |
| [ADR-004-active-user-tracking.ko.md](./decisions/ADR-004-active-user-tracking.ko.md) | 인메모리 슬라이딩 윈도우 및 일별 활성 사용자 컬렉션을 활용한 접속자 트래킹 채택 이유 |
| [ADR-005-sse-zombie-detection.ko.md](../../yoyaku_mate_server/docs/decisions/ADR-005-sse-zombie-detection.ko.md) | SSE 좀비 연결 감지 방식 — `select-default` 논블로킹 전송 채택 이유 |
| [ADR-006-sse-monitoring-polling.ko.md](../../yoyaku_mate_server/docs/decisions/ADR-006-sse-monitoring-polling.ko.md) | SSE 모니터링 대시보드의 통신 격리 및 HTTP 폴링 방식 채택 이유 |


---

## Troubles (트러블슈팅 / 회고)

| 문서 | 설명 |
|------|------|
| [001-lessons-learned.md](./troubles/001-lessons-learned.ko.md) | MUI 커스텀 테마, Custom Hook 분리, Vite 빌드 최적화 회고 |

---

## Refactoring (리팩토링)

*기록 예정*
