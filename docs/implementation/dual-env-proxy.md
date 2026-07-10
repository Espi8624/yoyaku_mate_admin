# ビルド/起動環境別のViteプロキシおよび環境分離の実装

> 最終更新: 2026-07-10  
> 関連ファイル: [`vite.config.js`](../../vite.config.js), [`src/api/adminService.js`](../../src/api/adminService.js)

## 問題背景

Adminダッシュボードは、ローカル開発環境と本番環境の接続先サーバー（APIおよびDB）を明確に区別する必要があります。
以前はUIタブを用いて画面上で動的にDev/Prod APIを切り替えるように実装されていましたが、ローカルでのDB接続の混乱や管理の複雑さを軽減するため、**アプリケーションの起動/ビルド時にロードされる環境変数(`.env`)に応じて、固定されたバックエンドにバインド**するように設定を改修しました。
また、ローカル開発時はCORS問題を回避するため、Vite開発サーバーのプロキシ機能を活用します。

---

## 解決方法: Viteサーバーの単一プロキシ統合

`vite.config.js`に単一のプロキシパス(`/api/admin`)を設定し、ロードされた起動モード(`.env`ファイル)で定義された `VITE_PROXY_TARGET` へリクエストをプロキシするように構成します。

```javascript
// vite.config.js
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/admin': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
          // /api/admin/* リクエストを target/api/admin/* へそのまま転送
        },
      },
    },
  }
})
```

---

## 環境別のURL分岐 (adminService.js)

`apiClient` 生成時、ローカル開発環境(`import.meta.env.DEV`)の場合はCORS回避のために相対パス `/api/admin` を `baseURL` として使用し、本番ビルド後のデプロイ環境では該当環境変数に指定された `VITE_API_BASE_URL` 絶対パスを使用するように設定しました。

```javascript
const isDev = import.meta.env.DEV;
const API_BASE_URL = isDev ? '/api/admin' : (import.meta.env.VITE_API_BASE_URL || '/api/admin');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});
```

| 起動モード | 起動コマンド | ロードされる環境ファイル | プロキシ対象 (`VITE_PROXY_TARGET`) | 本番用API (`VITE_API_BASE_URL`) |
|---------|---------|--------------|---------------|------------------|
| ローカル開発 (Dev) | `npm run dev:dev` | `.env.development` | `http://localhost:8080` (ローカル) | `http://localhost:8080/api/admin` |
| ローカル本番テスト (Prod) | `npm run dev:prod` | `.env.production` | `https://rusui-prod.fly.dev` (本番) | `https://rusui-prod.fly.dev/api/admin` |

---

## 環境変数ファイルの構成

```env
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api/admin
VITE_PROXY_TARGET=http://localhost:8080

# .env.production
VITE_API_BASE_URL=https://rusui-prod.fly.dev/api/admin
VITE_PROXY_TARGET=https://rusui-prod.fly.dev
```

---

## 関連文書

- [ADR-001: Viteプロキシ採用理由](../decisions/ADR-001-vite-proxy.md)
- [店舗審査機能の仕様](../features/store-approval.md)
