# 구현 상세서: 감사 로그 UI (Audit Log UI)

본 문서는 `yoyaku_mate_admin`에 구현된 감사 로그 (Audit Log) 프론트엔드 컴포넌트 및 백엔드 연동 구현 상세를 설명합니다.

> 작성일: 2026-07-22  
> 관련 문서: [감사 로그 기능 사양서](../features/audit-log.ko.md)

---

## 1. 컴포넌트 구조 (Component Structure)

`src/pages/AuditLogPage.jsx` 컴포넌트를 중심으로 구성되어 있습니다.

```
yoyaku_mate_admin/
├── src/
│   ├── api/
│   │   └── adminService.js     → getAuditLogs() API 함수
│   └── pages/
│       └── AuditLogPage.jsx    → 감사 로그 목록 및 필터 표시 React 컴포넌트
```

---

## 2. 구현 핵심 사항 (Implementation Details)

### 2.1 API 호출 함수 (`src/api/adminService.js`)

```javascript
/**
 * 監査ログ (Audit Log) 一覧を取得します。
 * @returns {Promise<Array>} 最新順最大100件の監査ログ配列
 */
export const getAuditLogs = async () => {
  try {
    const response = await apiClient.get('/metrics/audit-logs');
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
};
```

### 2.2 폴링 및 상태 관리 (`src/pages/AuditLogPage.jsx`)

* `useCallback`과 `setInterval`을 조합하여 5초 간격으로 자동 재조회를 실행합니다.
* 언마운트 시 `clearInterval`을 통해 타이머를 확실히 해제하여 메모리 누수를 방지합니다.

```javascript
const fetchLogs = useCallback(async () => {
  try {
    const data = await getAuditLogs();
    setLogs(data || []);
    setError(null);
  } catch (err) {
    console.error('Failed to fetch audit logs:', err);
    setError('監査ログの取得に失敗しました。');
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  fetchLogs();
  const interval = setInterval(fetchLogs, 5000);
  return () => clearInterval(interval);
}, [fetchLogs]);
```

### 2.3 컬러 매핑 및 Chip 컴포넌트 설계

`COLORS` 상수 파일 (`src/styles/colors.js`)의 통일된 테마에 맞춰 각 상태와 액션을 투명 배경 색상 (`22` alpha hex)이 적용된 MUI Chip으로 표현합니다.
