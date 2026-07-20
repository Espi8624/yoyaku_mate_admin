# 実装詳細書: Response Timeダッシュボード (Response Time Dashboard)

本文書は、`yoyaku_mate_admin` に実装されたAPIレイテンシモニタリングダッシュボードのフロントエンド技術設計および詳細な実装事項を説明します。

> 作成日: 2026-07-20  
> 関連文書: [機能仕様書: Response Timeダッシュボード](../features/response-time-dashboard.md)

---

## 1. ファイル構成

| ファイル | 変更タイプ | 役割 |
|---|---|---|
| `src/pages/ResponseTimePage.jsx` | 全面再作成 | ダッシュボードメイン画面コンポーネント |
| `src/api/adminService.js` | 関数追加 | `getResponseTimeMetrics(range)` API呼び出し関数 |

---

## 2. 状態構造

```jsx
const [range, setRange]         = useState('1h');    // 選択された時間範囲
const [summary, setSummary]     = useState({ avg_ms: 0, p95_ms: 0, p99_ms: 0, error_rate_pct: 0 });
const [endpoints, setEndpoints] = useState([]);       // エンドポイントテーブルデータ
const [loading, setLoading]     = useState(true);    // 初期ローディング状態
```

---

## 3. ポーリングおよび時間範囲連動

`range` 状態変更時に即座に再取得し、以降5秒インターバルで自動更新します。
`useCallback` で `fetchData` をメモイズし、`range` 変更時のみ関数が再生成されるよう処理します。

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

## 4. MUI ToggleButtonGroup 境界線バグ修正

MUI `ToggleButtonGroup` は隣接するボタン間の `border-left` を削除し `margin-left: -1px` で境界線を共有します。
選択されたボタンの右側の境界線色が次のボタンの裏に隠れて切れて見える現象が発生します。

**解決**: `gap` でボタンを物理的に分離し、`MuiToggleButtonGroup-grouped` クラスに独立した境界線を直接付与します。

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

## 5. 色の動的適用ロジック

### 5.1 レイテンシ閾値の色

```jsx
const getLatencyColor = (ms) => {
  if (ms === 0 || ms === null || ms === undefined) return COLORS.textMuted;
  if (ms < 100) return COLORS.success;   // 緑
  if (ms < 500) return COLORS.warning;   // 橙
  return COLORS.error;                    // 赤 (≥ 500ms)
};
```

### 5.2 エラー率閾値の色 (インライン条件)

```jsx
color: ep.error_pct > 5 ? COLORS.error : ep.error_pct > 1 ? COLORS.warning : COLORS.success
```

### 5.3 HTTPメソッドバッジの色

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

## 6. API連携

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

**呼び出しエンドポイント**: `GET /api/admin/metrics/response-time?range={5m|1h|24h}`

**レスポンス構造**:
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

## 関連ドキュメント
- [機能仕様書: Response Timeダッシュボード](../features/response-time-dashboard.md)
