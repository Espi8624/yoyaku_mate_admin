# アーキテクチャの概要

> 最終更新: 2026-07-10

## Tech Stack

| 項目 | 技術 |
|------|------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Router | React Router DOM 7 |
| UI Framework | Material UI (MUI) v7, Emotion |
| HTTP | Axios |
| デプロイ | Vercel |

---

## ディレクトリ構造

```
src/
├── api/
│   └── adminService.js       # すべての管理者用APIの定義 (環境に応じたAxiosインスタンスの生成)
│
├── pages/
│   └── StoreApprovalPage.jsx # 店舗承認のメインダッシュボード画面
│
├── components/
│   └── StoreDetailModal.jsx  # 店舗詳細モーダル (営業許可証画像表示 + 承認/却下ボタン)
│
├── hooks/                    # カスタムフック (非同期通信の状態を隠蔽)
├── styles/                   # MUIのグローバルカスタムテーマ設定
├── assets/                   # ロゴなどの静的画像アセット
├── App.jsx                   # ルーティング設定および基本レイアウト
└── main.jsx                  # アプリケーションのエントリーポイント
```

---

## データフロー

```
Admin UI (React)
    │
    ▼ (イベント / 操作)
Custom Hooks / イベントハンドラー
    │
    ▼ (API呼び出し)
adminService.js (Axios)
    │   ← 対象環境 (dev/prod) に応じて異なる baseURL を選択
    │
    ▼  ローカル時: Vite Proxy経由 / 本番時: 直接呼び出し
    │
Backend Admin API (/api/admin/*)
    │
    ├── MongoDB Atlas    ← 店舗のライセンスステータスの更新
    └── Cloudflare R2   ← 事業者登録証の一時アクセスURLの発行
```

---

## 環境別の API ルーティング

ローカル開発時は、Vite開発サーバーのプロキシ設定によって、CORSエラーを回避しながらDev環境とProd環境の両方に同時に接続します。

| リクエストパス | ローカル実行時 (Vite Proxy) | 本番配備時 (Vercel) |
|---------|-----------------|--------|
| `/proxy-dev/*` | `VITE_PROXY_DEV_TARGET/api/admin/*` | 直接接続 |
| `/proxy-prod/*` | `VITE_PROXY_PROD_TARGET/api/admin/*` | 直接接続 |

→ 詳細は [dual-env-proxy.md](./dual-env-proxy.md) を参照。

---

## 関連ドキュメント

- [店舗ライセンス審査機能](../features/store-approval.md)
- [Dev/Prod 二重環境 Vite プロキシの実装](./dual-env-proxy.md)
- [ADR-001: Vite 開発サーバープロキシの採用](../decisions/ADR-001-vite-proxy.md)
