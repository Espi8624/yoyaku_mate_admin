# 기능 사양서: 시스템 메트릭스 대시보드 (System Metrics Dashboard)

본 문서는 관리자용 화면(`yoyaku_mate_admin`)의 **시스템 메트릭스 (System Metrics)** 기능에 대한 프론트엔드 요구사항 및 사양을 정의합니다.

> 작성일: 2026-07-23  
> 대상: `yoyaku_mate_admin` (React UI)

---

## 1. 개요 (Overview)
관리자가 백엔드 서버(fly.io 인스턴스)의 실제 하드웨어 리소스(CPU, Memory, Disk) 상태를 실시간으로 모니터링하기 위한 페이지입니다. 서버 장애를 사전에 감지하고 직관적인 인포그래픽으로 상태를 파악할 수 있도록 돕습니다.

## 2. 주요 기능 및 요구사항 (Key Features & Requirements)

### 2.1 하드웨어 리소스 지표 시각화
- **CPU USAGE**: 전체 CPU 사용률 (%)
- **MEMORY USAGE**: 전체 가상 메모리 사용률 (%)
- **DISK SPACE**: 루트(`/`) 파티션의 디스크 사용률 (%)
- 위 3가지 지표를 카드(Card) 컴포넌트로 나란히 배치하여 한눈에 파악할 수 있도록 합니다.

### 2.2 5초 주기 실시간 자동 갱신 (Polling)
- 웹소켓(WebSocket) 대신 구현 복잡도가 낮고 효율적인 **5초 주기 폴링(Polling)** 방식을 적용합니다.
- 관리자가 해당 메뉴 탭에 머물러 있는 동안에만 5초마다 API(`GET /api/admin/metrics/system`)를 호출하여 화면의 수치를 동기화합니다.

### 2.3 UX/UI 설계 (MUI 기반)
- **Linear Progress Bar**: 단순 수치뿐만 아니라 MUI의 `<LinearProgress />`를 사용하여 차오르는 정도를 시각적으로 제공합니다.
  - CPU: Primary 색상 (파란색 계열)
  - Memory: Info 색상 (하늘색 계열)
  - Disk: Warning 색상 (주황/노란색 계열)
- **로딩 및 예외 처리**:
  - 최초 진입 시 로딩 스피너(`<CircularProgress />`)를 중앙에 표시합니다.
  - API 통신 실패 시, 화면 레이아웃을 유지한 채 에러 메시지("시스템 메트릭스를 불러오는 데 실패했습니다.")를 상단에 노출합니다.

---

## 3. 관련 문서
- [시스템 메트릭스 대시보드 구현 상세서](../implementation/system-metrics-dashboard.ko.md)
