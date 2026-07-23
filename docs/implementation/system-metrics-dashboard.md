# 実装詳細書: システムメトリクスダッシュボード (System Metrics Dashboard)

本ドキュメントは、`yoyaku_mate_admin` (Reactフロントエンド)においてシステムメトリクスを取得し、レンダリングするために実装された詳細な技術内容を説明します。

> 作成日: 2026-07-23  
> 関連ドキュメント: [システムメトリクス機能仕様書](../features/system-metrics-dashboard.md)

---

## 1. コンポーネント構造とレンダリング (Component Structure)

### 1.1 `SystemMetricsPage.jsx`
ダッシュボードのメインエントリーポイントとして機能するページコンポーネントです。状態管理（`useState`）とライフサイクル管理（`useEffect`）を担当し、下位のUI要素をレンダリングします。

- **状態(State)管理**:
  ```javascript
  const [metrics, setMetrics] = useState({ cpuUsage: 0, memoryUsage: 0, diskSpace: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  ```
  API通信状態（ローディング、エラー）と実際のデータ状態を完全に分離し、ネットワークエラー時にも既存のデータレイアウトが崩れないよう防御ロジックを構成しました。

### 1.2 MUI ベースのレスポンシブグリッド
`@mui/material` の `Grid` システムを使用し、ブラウザの幅に応じてレスポンシブに動作するように構成しました。
- `xs={12}`: モバイルデバイスではカードが縦に1つずつ（全幅）配置されます。
- `md={4}`: タブレット以上のサイズでは全体12グリッドのうち4ずつを占め、横に3つのカードが並んで配置されます。

---

## 2. API 通信およびデータ更新ロジック

### 2.1 API サービスの連携 (`adminService.js`)
バックエンド（`yoyaku_mate_server`）で定義された `/metrics/system` エンドポイントを呼び出す専用の非同期関数を作成しました。

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
バックエンドのレスポンスJSON構造（`{ status: "success", data: { ... } }`）を安全に展開するオプショナルチェイニング（`?.`）を適用しました。

### 2.2 ポーリング (Polling) インターバルの適用
SSEやWebSocketを使用せず、最もシンプルで信頼性の高い `setInterval` ポーリング方式を採用しました。

```javascript
  useEffect(() => {
    fetchMetrics(); // 初期データのロード（ローディングスピナー終了用）
    const interval = setInterval(fetchMetrics, 5000); // 5秒ごとに更新
    return () => clearInterval(interval); // コンポーネントのアンマウント時のメモリリーク防止
  }, []);
```
この方式は、管理者がこのページにアクセスしている時のみ動作するため、不要なバックグラウンドリソースの消費を完全に遮断します。

---

## 3. エラーハンドリングとエッジケース (Error Handling)

- **バックエンドのダウンまたはネットワーク切断時**: 
  - `fetchMetrics()` 内の `catch` ブロックが実行され、`setError` を通じて上部にエラーメッセージが表示されます。
  - 既存の正常に取得していた最新の `metrics` 数値とプログレスバーは画面から消えることなくそのまま維持され、ユーザーの混乱を最小限に抑えます。
- **初回ロード遅延時**: 
  - 初回データを取得するまで中央に `<CircularProgress />` を表示し、白い画面（Blank page）が露出するのを防ぎました。

---

## 関連ドキュメント
- [機能仕様書: システムメトリクスダッシュボード](../features/system-metrics-dashboard.md)
