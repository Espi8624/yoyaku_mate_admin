# 구현 상세서: Response Time 대시보드 (Response Time Dashboard)

본 문서는 `yoyaku_mate_admin`에 구현된 API 레이턴시 모니터링 대시보드의 프론트엔드 기술 설계 및 세부 구현사항을 설명합니다.

> 작성일: 2026-07-20  
> 관련 문서: [기능 사양서: Response Time 대시보드](../features/response-time-dashboard.ko.md)

---

## 1. 파일 구성

| 파일 | 변경 유형 | 역할 |
|---|---|---|
| `src/pages/ResponseTimePage.jsx` | 전면 재작성 | 대시보드 메인 화면 컴포넌트 |
| `src/api/adminService.js` | 함수 추가 | `getResponseTimeMetrics(range)` API 호출 함수 |

---

## 2. 상태 구조

```jsx
const [range, setRange]         = useState('1h');    // 선택된 시간 범위
const [summary, setSummary]     = useState({ avg_ms: 0, p95_ms: 0, p99_ms: 0, error_rate_pct: 0 });
const [endpoints, setEndpoints] = useState([]);       // 엔드포인트 테이블 데이터
const [loading, setLoading]     = useState(true);    // 초기 로딩 상태
```

---

## 3. 폴링 및 시간 범위 연동

`range` 상태 변경 시 즉시 재조회하고, 이후 5초 인터벌로 자동 갱신합니다.
`useCallback`으로 `fetchData`를 메모이제이션하여 `range`가 바뀔 때만 함수가 재생성되도록 처리합니다.

```jsx
const fetchData = useCallback(async () => {
  try {
    const data = await getResponseTimeMetrics(range);
    setSummary(data?.summary || { avg_ms: 0, p95_ms: 0, p99_ms: 0, error_rate_pct: 0 });
    setEndpoints(data?.endpoints || []);
  } catch (err) {
    console.error('Failed to load response time metrics', err);
  } finally {
    setLoading(false);
  }
}, [range]);

useEffect(() => {
  setLoading(true);
  fetchData();
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, [fetchData]);
```

---

## 4. MUI ToggleButtonGroup 테두리 버그 수정

MUI `ToggleButtonGroup`은 인접 버튼 사이의 `border-left`를 제거하고 `margin-left: -1px`로 공유 테두리를 만듭니다.
선택된 버튼의 오른쪽 테두리 색상이 다음 버튼 뒤에 숨어 잘리는 현상이 발생합니다.

**해결**: `gap`으로 버튼을 물리적으로 분리하고, `MuiToggleButtonGroup-grouped` 클래스에 독립 테두리를 직접 부여합니다.

```jsx
sx={{
  gap: 0.75,
  '& .MuiToggleButtonGroup-grouped': {
    border: `1px solid ${COLORS.borderLight} !important`,
    borderRadius: '6px !important',
    mx: 0,
  },
  '& .MuiToggleButton-root': {
    '&.Mui-selected': {
      borderColor: `${COLORS.primary} !important`,
    },
  },
}}
```

---

## 5. 색상 동적 적용 로직

### 5.1 레이턴시 임계치 색상

```jsx
const getLatencyColor = (ms) => {
  if (ms === 0 || ms === null || ms === undefined) return COLORS.textMuted;
  if (ms < 100) return COLORS.success;   // 녹색
  if (ms < 500) return COLORS.warning;   // 주황
  return COLORS.error;                    // 빨강 (≥ 500ms)
};
```

### 5.2 에러율 임계치 색상 (인라인 조건)

```jsx
color: ep.error_pct > 5 ? COLORS.error : ep.error_pct > 1 ? COLORS.warning : COLORS.success
```

### 5.3 HTTP 메서드 뱃지 색상

```jsx
const getMethodColor = (method) => {
  switch (method?.toUpperCase()) {
    case 'GET':    return COLORS.info;
    case 'POST':   return COLORS.success;
    case 'PATCH':  return COLORS.warning;
    case 'DELETE': return COLORS.error;
    default:       return COLORS.textMuted;
  }
};
```

---

## 6. API 연동

### `getResponseTimeMetrics(range)`

```js
// src/api/adminService.js
export const getResponseTimeMetrics = async (range = '1h') => {
  try {
    const response = await apiClient.get(`/metrics/response-time?range=${range}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching response time metrics:', error);
    throw error;
  }
};
```

**호출 엔드포인트**: `GET /api/admin/metrics/response-time?range={5m|1h|24h}`

**응답 구조**:
```json
{
  "summary": {
    "avg_ms": 45.2,
    "p95_ms": 220.0,
    "p99_ms": 850.5,
    "error_rate_pct": 1.2
  },
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/admin/stores",
      "avg_ms": 180.3,
      "p95_ms": 420.0,
      "p99_ms": 850.5,
      "count": 1240,
      "error_pct": 2.1
    }
  ]
}
```

---

## 관련 문서
- [기능 사양서: Response Time 대시보드](../features/response-time-dashboard.ko.md)
