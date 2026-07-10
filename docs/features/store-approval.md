# 店舗ライセンス審査機能 (Store Approval)

> 最終更新: 2026-07-10  
> 関連ファイル: [`src/pages/StoreApprovalPage.jsx`](../../src/pages/StoreApprovalPage.jsx), [`src/components/StoreDetailModal.jsx`](../../src/components/StoreDetailModal.jsx), [`src/api/adminService.js`](../../src/api/adminService.js)

## 概要

新規店舗が提出した事業者登録証を本社管理者が確認し、承認または却下を行うバックオフィスワークフローです。  
開発(Dev)環境と本番(Prod)環境を同一画面内でタブ切り替えにより同時に管理可能です。

---

## 画面構成

```
StoreApprovalPage
│
├── 環境タブ (Dev / Prod)        ← 管理対象のバックエンド環境の切り替え
│
├── 状態タブ
│   ├── 申請中 (PENDING_REVIEW)
│   ├── 承認済み (APPROVED)
│   └── 却下済み (REJECTED)
│
└── 店舗一覧テーブル
    └── [詳細表示・処理] ボタン → StoreDetailModal が開く
```

---

## StoreDetailModal の動作

モダルが開いた際、自動的に事業者登録証（営業許可証）の画像をロードします。

```
モーダルオープン
    │
    ▼
getLicenseImageUrl(store.license_image_url, environment)
    │   ← DB上のファイルキーを用いて5分間有効な一時アクセスURLを発行
    │
    ▼
<img src={temporaryUrl} /> を表示
    │
    ├── [承認] → updateStoreStatus(storeId, 'APPROVED')
    └── [拒否] → updateStoreStatus(storeId, 'REJECTED', rejectReason)
                  ※ 拒否時は理由入力が必須
```

---

## 店舗ライセンス状態値 (Status)

| 状態 | 説明 |
|------|------|
| `PENDING_REVIEW` | 申請完了、審査待ち状態 |
| `APPROVED` | 承認完了 — サービス利用可能 |
| `REJECTED` | 却下済み — 却下理由を含む |

---

## API一覧

| 関数 | エンドポイント | 説明 |
|------|-----------|------|
| `getStoresByStatus(status, env)` | `GET /api/admin/stores?status=` | ステータス別の店舗一覧照会 |
| `updateStoreStatus(storeId, status, comment, env)` | `PATCH /api/admin/stores/{storeId}/status` | 承認 / 却下の実行 |
| `getLicenseImageUrl(imageKey, env)` | `GET /api/admin/license-image-url?key=` | 営業許可証の一時アクセスURL取得 |

すべてのAPIは `environment` パラメータ(`'dev'` または `'prod'`)を受け取り、対象の宛先サーバーを動的に切り替えます。

---

## 環境切り替え時の動作

環境タブを変更した際、状態タブは自動的に `PENDING_REVIEW` (申請中)へリセットされます。

```javascript
const handleEnvChange = (envKey) => {
  setActiveEnv(envKey);
  setActiveTab('PENDING_REVIEW');  // ステータスタブをリセット
};
```

---

## 関連ドキュメント

- [Dev/Prod 二重環境 Vite プロキシの実装](../implementation/dual-env-proxy.md)
- [アーキテクチャの概要](../implementation/architecture.md)
