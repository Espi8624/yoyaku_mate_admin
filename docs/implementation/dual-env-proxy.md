# Dev/Prod 二重環境 Vite プロキシの実装

> 最終更新: 2026-07-10  
> 関連ファイル: [`vite.config.js`](../../vite.config.js), [`src/api/adminService.js`](../../src/api/adminService.js)

## 課題の背景

Admin管理用ダッシュボードでは、開発(Dev)サーバーと本番(Prod)サーバーのデータを **画面内のタブ切り替えのみでシームレスに操作** できる必要がありました。  
しかし、ローカルのブラウザから外部サーバーへ直接リクエストを送るとCORSエラーが発生してしまいます.

---

## 解決策: Vite開発サーバーによるマルチプロキシ設計

`vite.config.js` にて、パスの接頭辞(prefix)に応じてフォワード先を分けるように設定します。

```javascript
// vite.config.js
proxy: {
  '/proxy-dev': {
    target: env.VITE_PROXY_DEV_TARGET,    // 開発サーバーのURL
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/proxy-dev/, '/api/admin'),
  },
  '/proxy-prod': {
    target: env.VITE_PROXY_PROD_TARGET,   // 本番サーバーのURL
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/proxy-prod/, '/api/admin'),
  },
}
```

---

## 環境別のエンドポイント切り替え (adminService.js)

```javascript
const isDev = import.meta.env.DEV;

export const ENV_URLS = {
  dev:  isDev ? '/proxy-dev'  : `${import.meta.env.VITE_PROXY_DEV_TARGET}/api/admin`,
  prod: isDev ? '/proxy-prod' : `${import.meta.env.VITE_PROXY_PROD_TARGET}/api/admin`,
};
```

| クライアント動作環境 | `dev` API 送信先 | `prod` API 送信先 |
|---------|--------------|---------------|
| ローカル (`npm run dev`) | `/proxy-dev` → Vite Proxy → Devサーバー | `/proxy-prod` → Vite Proxy → Prodサーバー |
| 本番ビルド配備 (Vercel) | Devサーバーの絶対URL | Prodサーバーの絶対URL |

---

## ローカル環境変数

```env
# .env.development
VITE_PROXY_DEV_TARGET=http://localhost:8080
VITE_PROXY_PROD_TARGET=https://your-production-server.fly.dev
```

---

## 関連ドキュメント

- [ADR-001: Vite 開発サーバープロキシの採用](../decisions/ADR-001-vite-proxy.md)
- [店舗ライセンス審査機能](../features/store-approval.md)
