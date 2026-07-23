# 구현 상세서: 시스템 메트릭스 대시보드 (System Metrics Dashboard)

본 문서는 `yoyaku_mate_admin` (React 프론트엔드)에서 시스템 메트릭스를 조회하고 렌더링하기 위해 구현된 상세 기술 내역을 설명합니다.

> 작성일: 2026-07-23  
> 관련 문서: [시스템 메트릭스 기능 사양서](../features/system-metrics-dashboard.ko.md)

---

## 1. 컴포넌트 구조 및 렌더링 (Component Structure)

### 1.1 `SystemMetricsPage.jsx`
대시보드의 메인 진입점 역할을 하는 페이지 컴포넌트입니다. 상태 관리(`useState`)와 생명주기 관리(`useEffect`)를 담당하며 하위 UI 요소를 렌더링합니다.

- **상태(State) 관리**:
  ```javascript
  const [metrics, setMetrics] = useState({ cpuUsage: 0, memoryUsage: 0, diskSpace: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  ```
  API 통신 상태(로딩, 에러)와 실제 데이터 상태를 완벽히 분리하여, 네트워크 오류 시에도 기존 데이터 레이아웃이 무너지지 않도록 방어 로직을 구성했습니다.

### 1.2 MUI 기반 반응형 그리드
`@mui/material`의 `Grid` 시스템을 사용하여 브라우저 너비에 따라 반응형으로 동작하도록 구성했습니다.
- `xs={12}`: 모바일 디바이스에서는 카드가 세로로 1개씩(전체 너비) 배치됩니다.
- `md={4}`: 태블릿 이상 사이즈에서는 전체 12그리드 중 4씩 차지하여 가로로 3개의 카드가 나란히 배치됩니다.

---

## 2. API 통신 및 데이터 갱신 로직

### 2.1 API 서비스 연동 (`adminService.js`)
백엔드(`yoyaku_mate_server`)에서 정의한 `/metrics/system` 엔드포인트를 호출하는 전용 비동기 함수를 작성했습니다.

```javascript
export const getSystemMetrics = async () => {
  try {
    const response = await apiClient.get('/metrics/system');
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    throw error;
  }
};
```
백엔드의 Response JSON 구조(`{ status: "success", data: { ... } }`)를 안전하게 벗겨내는 옵셔널 체이닝(`?.`)을 적용했습니다.

### 2.2 폴링(Polling) 인터벌 적용
SSE나 WebSocket 없이 가장 심플하고 신뢰성 높은 `setInterval` 폴링 방식을 채택했습니다. 

```javascript
  useEffect(() => {
    fetchMetrics(); // 초기 데이터 로드 (로딩 스피너 종료 용도)
    const interval = setInterval(fetchMetrics, 5000); // 5초마다 갱신
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 메모리 누수 방지
  }, []);
```
이 방식은 관리자가 이 페이지에 접속 중일 때만 동작하므로 불필요한 백그라운드 리소스 소모를 완벽히 차단합니다.

---

## 3. 에러 핸들링 및 엣지 케이스 (Error Handling)

- **백엔드 다운 혹은 네트워크 단절 시**: 
  - `fetchMetrics()` 내의 `catch` 블록이 실행되며 `setError`를 통해 상단에 에러 문구가 표시됩니다.
  - 기존에 정상적으로 받아두었던 마지막 `metrics` 수치와 프로그레스 바는 화면에서 사라지지 않고 그대로 유지되어 사용자 혼란을 최소화합니다.
- **초기 로딩 지연 시**: 
  - 최초 1회 데이터를 받아오기 전까지 중앙에 `<CircularProgress />`를 띄워 흰 화면(Blank page)이 노출되는 것을 방지했습니다.

---

## 관련 문서
- [기능 사양서: 시스템 메트릭스 대시보드](../features/system-metrics-dashboard.ko.md)
