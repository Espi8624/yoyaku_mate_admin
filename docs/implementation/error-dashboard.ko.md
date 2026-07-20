# 구현 상세서: 에러 대시보드 (Error Dashboard)

본 문서는 `yoyaku_mate_admin` React 관리자 웹에 구현된 에러 대시보드의 프론트엔드 기술 설계 및 세부 구현사항을 설명합니다.

> 작성일: 2026-07-14  
> 관련 문서: [기능 사양서: 에러 대시보드](../features/error-dashboard.ko.md), [ADR-002: 에러 대시보드 내 HTTP 폴링 방식 채택](../decisions/ADR-002-use-polling-for-error-dashboard.ko.md)

> **백엔드 아키텍처 참조**: 서버의 에러 수집 파이프라인(ErrorTracker, Batch Worker, DB 스키마)은 [구현 상세서: 에러 대시보드 (서버)](../../../yoyaku_mate_server/docs/implementation/error-dashboard.ko.md)를 참조하세요.

---

## 1. 파일 구성

| 파일 | 역할 |
|---|---|
| `src/pages/ErrorCountPage.jsx` | 에러 대시보드 메인 화면 컴포넌트 |
| `src/api/adminService.js` | `getErrorMetrics()`, `getErrorLogs()` API 호출 함수 |

---

## 2. 프론트엔드 구현 상세 (`yoyaku_mate_admin`)

### 2.1 MUI Grid v2 반응형 사이즈 바인딩

Grid v2의 `size` 프로퍼티를 적용하여 데스크톱(4열), 태블릿(2열), 모바일(1열) 반응형 레이아웃을 구현했습니다.

```jsx
<Grid size={{ xs: 12, md: 6, lg: 3 }}>
  <Card>...</Card>
</Grid>
```

### 2.2 5초 실시간 데이터 폴링 및 봉투 해제

- React `useEffect` 내 `setInterval`을 통한 5초 주기 폴링 구현.
- API 연동 시 `{ status: "success", data: ... }` 봉투를 해제하여 `response.data?.data || response.data` 형태로 데이터 리액트 훅으로 매핑.

---

## 3. API 사양서 (API Specification)

### 3.1 에러 통계 요약 조회

* **Endpoint**: `GET /api/admin/metrics/errors`
* **Response (200 OK)**:
  ```json
  {
    "500_INTERNAL_ERROR": 2,
    "400_BAD_REQUEST": 15,
    "DATABASE_ERROR": 0,
    "SSE_DISCONNECT": 4
  }
  ```

### 3.2 최근 상세 에러 로그 목록 조회

* **Endpoint**: `GET /api/admin/metrics/error-logs`
* **Response (200 OK)**:
  ```json
  [
    {
      "id": "60c72b2f9b1d8b2d88c2901a",
      "timestamp": "2026-07-14T11:45:00Z",
      "error_type": "500_INTERNAL_ERROR",
      "message": "connection timed out",
      "path": "/api/waiting-list",
      "method": "POST",
      "client_ip": "203.0.113.195"
    }
  ]
  ```

---

## 관련 문서
- [기능 사양서: 에러 대시보드](../features/error-dashboard.ko.md)
- [ADR-002: 에러 대시보드 내 HTTP 폴링 방식 채택](../decisions/ADR-002-use-polling-for-error-dashboard.ko.md)
- [구현 상세서: 에러 대시보드 (서버)](../../../yoyaku_mate_server/docs/implementation/error-dashboard.ko.md)
