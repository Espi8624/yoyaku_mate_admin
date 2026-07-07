# 👑 Yoyaku Mate - 統合管理者プラットフォーム（Admin Web）

> **Yoyaku Mate** 統合管理プラットフォームは、サービス全体を統括する本部管理者向けの **Web バックオフィス**プロジェクトです。サービスへの出店を申請したパートナー店舗の申請書類を審査し、出店の承認・否認などの店舗ライセンス管理および統合プラットフォームの運営を担当します。

---

## 🛠 Tech Stack（技術スタック）

- **Frontend Core:** React 19、React Router DOM 7
- **Build Tool:** Vite 7（高速 HMR および最適化されたビルドパフォーマンスを提供）
- **UI Framework:** Material UI (MUI) v7 / Emotion
- **HTTP Client:** Axios（API 非同期通信）
- **Deployment:** Vercel / Fly.io

---

## ✨ Key Features（主要機能）

- **出店申請店舗の審査（Approval System）：** 新規登録を申請した店舗の一覧を確認し、承認・否認の処理を行います。
- **店舗詳細情報モーダル：** 出店申請店舗の詳細情報（代表者情報・営業カテゴリ等）を詳しく参照できます。
- **リアルタイムデータバインディング：** バックエンド API との連携を通じ、処理ステータスをリアルタイムでダッシュボードに反映します。

---

## 📂 Project Structure（フォルダ構成）

```bash
src/
├── api/                  # API クライアントおよび通信ロジックの定義
├── assets/               # ロゴ・画像等の静的アセット
├── components/           # 共通再利用コンポーネント（例：StoreDetailModal）
├── hooks/                # 状態およびビジネスロジック処理のカスタムフック
├── pages/                # ページコンポーネント（例：StoreApprovalPage）
├── styles/               # グローバルスタイルシートおよび MUI カスタムテーマ
├── App.jsx               # ルーター設定とメインアプリ構造
└── main.jsx              # アプリのエントリーポイント
```

---

## 🚀 Getting Started（セットアップガイド）

### 1. 環境変数の設定

ローカル開発環境を構築するため、プロジェクトルートディレクトリに `.env.development` ファイルを作成します。

```env
# 管理者 API バックエンドサーバーアドレス
VITE_PROXY_DEV_TARGET=http://localhost:8080
VITE_PROXY_PROD_TARGET=https://YOUR_BACKEND_DOMAIN
```

### 2. パッケージのインストールと起動

```bash
# 依存パッケージのインストール
npm install

# ローカル開発サーバーの起動（Vite）
npm run dev
```

起動が完了したら、ターミナルに表示されるアドレス（デフォルト：`http://localhost:5173`）からブラウザでアクセスしてください。

---

## 🔒 Security & Deployment（デプロイおよびセキュリティ）

- **デプロイ：** Vercel 等を用いた静的 Web ホスティング環境を推奨します。
- **認証および認可：** 許可された本部管理者のみがアクセスできるよう、バックエンド API エンドポイントにセキュリティフィルターが適用されています。
