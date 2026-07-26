# 아키텍처 개요

> 최종 수정: 2026-07-10

## 기술 스택

| 항목 | 기술 |
|------|------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Router | React Router DOM 7 |
| UI Framework | Material UI (MUI) v7, Emotion |
| HTTP | Axios |
| Deployment | Vercel |

---

## 디렉토리 구조

```
src/
├── api/
│   └── adminService.js       # 모든 Admin API 호출 정의 (환경별 Axios 인스턴스 생성)
│
├── pages/
│   ├── StoreApprovalPage.jsx # 점포 심사 메인 화면 (환경 탭 + 상태 탭 + 목록 테이블)
│   ├── ErrorCountPage.jsx    # 실시간 에러 로깅 모니터링 대시보드
│   ├── RequestCountPage.jsx  # 실시간 API 트래픽 수집 대시보드
│   ├── ActiveUserPage.jsx    # 실시간 활성 사용자(Concurrent/DAU/MAU) 대시보드
│   ├── ResponseTimePage.jsx  # 실시간 레이턴시(avg/P95/P99) 모니터링 대시보드
│   ├── AuditLogPage.jsx      # 관리자 작업 감사 로그 자동 갱신 및 확인 화면
│   ├── SystemMetricsPage.jsx # 시스템 하드웨어 리소스(CPU/Mem/Disk) 실시간 모니터링 화면
│   └── DbMetricsPage.jsx     # 실시간 DB 메트릭스(커넥션, 용량, 슬로우 쿼리) 대시보드
│
├── components/
│   └── StoreDetailModal.jsx  # 점포 상세 모달 (사업자등록증 이미지 + 승인/거절 버튼)
│
├── hooks/                    # 커스텀 훅 (비동기 통신 상태 캡슐화)
├── styles/                   # MUI 글로벌 테마 설정
├── assets/                   # 로고 등 정적 이미지 에셋
├── App.jsx                   # 라우팅 설정 및 레이아웃
└── main.jsx                  # 앱 진입점
```

---

## 데이터 흐름

```
Admin UI (React)
    │
    ▼
Custom Hooks / Event Handler
    │
    ▼
adminService.js (Axios Instance)
    │   ← 환경(dev/prod)에 따라 다른 baseURL 선택
    │
    ▼  Vite Proxy (로컬) / 직접 요청 (Vercel)
    │
    ▼
Backend Admin API (/api/admin/*)
    │
    ├── MongoDB Atlas      ← 점포 상태 업데이트, 에러/리퀘스트 로그 및 DAU/MAU 조회
    ├── Go Server Memory   ← 실시간 동시 접속자(5분 슬라이딩 윈도우) 및 SSE 연결 통계 조회 (DB 조회 없음)
    └── Cloudflare R2      ← 사업자등록증 임시 URL 발급
```

---

## 환경별 API 라우팅

로컬 개발 시 Vite 개발 서버의 프록시를 통해 CORS 없이 두 환경(Dev/Prod)에 동시 접근합니다.

| 요청 경로 | 로컬 (Vite Proxy) | Vercel |
|---------|-----------------|--------|
| `/proxy-dev/*` | `VITE_PROXY_DEV_TARGET/api/admin/*` | 직접 설정 |
| `/proxy-prod/*` | `VITE_PROXY_PROD_TARGET/api/admin/*` | 직접 설정 |

→ 상세: [dual-env-proxy.md](./dual-env-proxy.ko.md)

---

## 관련 문서

- [점포 심사 기능 사양](../features/store-approval.ko.md)
- [에러 대시보드 기능 사양](../features/error-dashboard.ko.md)
- [리퀘스트 카운터 기능 사양](../features/request-counter.ko.md)
- [활성 사용자 대시보드 기능 사양](../features/active-user-dashboard.ko.md)
- [SSE 상태 모니터링 기능 사양](../features/sse-monitoring.ko.md)
- [감사 로그 기능 사양](../features/audit-log.ko.md)
- [시스템 메트릭스 대시보드 구현 상세](./system-metrics-dashboard.ko.md)
- [DB 메트릭스 대시보드 구현 상세](./db-metrics.ko.md)
- [Dev/Prod 이중 환경 프록시 구현](./dual-env-proxy.ko.md)
- [ADR-001: Vite 프록시 채택](../decisions/ADR-001-vite-proxy.ko.md)
- [ADR-002: 에러 대시보드 내 HTTP 폴링 방식 채택](../../../yoyaku_mate_server/docs/decisions/ADR-002-use-polling-for-error-dashboard.ko.md)
- [ADR-006: SSE 모니터링 대시보드의 통신 격리 및 HTTP 폴링 방식 채택](../../../yoyaku_mate_server/docs/decisions/ADR-006-sse-monitoring-polling.ko.md)

---

## 향후 개발 과제 (TODO)

### 이메일 알림 연동 (Resend API)
서버 장애(응답 지연, 에러 급증, CPU 과부하 등) 발생 시 관리자에게 즉각적인 이메일 알림을 발송하는 기능은 추후 개발로 연기되었습니다.
- **방향성**: 외부 메일 발송 서비스인 [Resend](https://resend.com) API를 활용하여 무료 티어 내에서 알림 시스템을 구축합니다.
- **구현 계획**:
  1. 서버(Go)에서 5분 주기로 메트릭스를 모니터링하는 백그라운드 Worker 구현.
  2. 시스템 임계치(Threshold) 초과 시 Resend API를 통해 이메일 발송 (`utils/email.go`).
  3. 관리자 패널(`AlertPage.jsx`)에서 임계치 설정(Error Rate, API Latency 등) 및 테스트 메일 발송 기능 구현.
