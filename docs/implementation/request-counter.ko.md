# 구현 상세서: 리퀘스트 카운터 (Request Counter)

본 문서는 `yoyaku_mate_admin` React 관리자 웹에 구현된 리퀘스트 카운터 대시보드의 프론트엔드 기술 설계 및 세부 구현사항을 설명합니다.

> 작성일: 2026-07-14  
> 관련 문서: [리퀘스트 대시보드 기능 사양서](../features/request-counter.ko.md), [ADR-003: 자체 메트릭 수집 및 리퀘스트 카운터 아키텍처 채택](../decisions/ADR-003-request-counter-architecture.ko.md)

> **백엔드 아키텍처 참조**: 서버의 요청 수집 파이프라인(MetricsMiddleware, RequestTracker, Batch Worker, DB 스키마)은 [구현 상세서: 리퀘스트 카운터 (서버)](../../../yoyaku_mate_server/docs/implementation/request-counter.ko.md)를 참조하세요.

---

## 1. 파일 구성

| 파일 | 역할 |
|---|---|
| `src/pages/RequestCountPage.jsx` | 리퀘스트 카운터 대시보드 메인 화면 컴포넌트 |
| `src/api/adminService.js` | `getRequestMetrics()`, `getRequestLogs()` API 호출 함수 |

---

## 2. 프론트엔드 구현 상세 (`yoyaku_mate_admin`)

### 2.1 5초 실시간 데이터 폴링

React `useEffect` 내 `setInterval`을 통해 5초 주기로 자동 갱신합니다.

```jsx
useEffect(() => {
  fetchData();
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, []);
```

### 2.2 API 응답 봉투 해제

API 연동 시 `{ status: "success", data: ... }` 봉투를 해제하여 `response.data?.data || response.data` 형태로 리액트 훅에 매핑합니다.

---

## 3. API 사양서 (API Specification)

### 3.1 리퀘스트 집계 및 메트릭 조회

* **Endpoint**: `GET /api/admin/metrics/requests`
* **Response (200 OK)**:
  ```json
  {
    "total_requests": 14050,
    "success_rate": 99.8,
    "peak_tps": 12
  }
  ```

### 3.2 최근 상세 리퀘스트 로그 목록 조회

* **Endpoint**: `GET /api/admin/metrics/request-logs`
* **Response (200 OK)**:
  ```json
  [
    {
      "id": "60c72b2f9b1d8b2d88c2901a",
      "timestamp": "2026-07-14T11:45:00Z",
      "path": "/api/waiting-list",
      "method": "POST",
      "status_code": 200,
      "latency_ms": 25,
      "client_ip": "203.0.113.195"
    }
  ]
  ```

---

## 관련 문서
- [기능 사양서: 리퀘스트 카운터](../features/request-counter.ko.md)
- [ADR-003: 자체 메트릭 수집 및 리퀘스트 카운터 아키텍처 채택](../decisions/ADR-003-request-counter-architecture.ko.md)
- [구현 상세서: 리퀘스트 카운터 (서버)](../../../yoyaku_mate_server/docs/implementation/request-counter.ko.md)
