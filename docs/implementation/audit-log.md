# 実装詳細書: 監査ログUI (Audit Log UI)

本文書は、`yoyaku_mate_admin` に実装された監査ログ (Audit Log) フロントエンドコンポーネントおよびバックエンド連動の実装詳細を説明します。

> 作成日: 2026-07-22  
> 関連文書: [監査ログ機能仕様書](../features/audit-log.md)

---

## 1. コンポーネント構造 (Component Structure)

`src/pages/AuditLogPage.jsx` コンポーネントを中心に構成されています。

```
yoyaku_mate_admin/
├── src/
│   ├── api/
│   │   └── adminService.js     → getAuditLogs() API 関数
│   └── pages/
│       └── AuditLogPage.jsx    → 監査ログ一覧およびフィルター表示 React コンポーネント
```

---

## 2. 実装のポイント (Implementation Details)

### 2.1 API 呼び出し関数 (`src/api/adminService.js`)

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

### 2.2 ポーリングおよびステート管理 (`src/pages/AuditLogPage.jsx`)

* `useCallback` と `setInterval` を組み合わせて 5秒間隔で自動再取得を実行。
* アンマウント時に `clearInterval` によりタイマーを確実に解除し、メモリリークを防止。

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

### 2.3 カラーマッピングと Chip コンポーネント設計

`COLORS` 定数ファイル (`src/styles/colors.js`) の統一テーマに従い、各種ステータスやアクションを透過背景カラー (`22` alpha hex) を適用した MUI Chip で表現しています。
