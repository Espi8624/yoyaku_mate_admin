# docs — yoyaku_mate_admin ドキュメントインデックス

## 構造

```
docs/
├── features/           # 機能仕様 (何をするのか)
├── implementation/     # 技術実装詳細 (どのように実装したのか)
├── decisions/          # 技術選定根拠 (ADR)
├── troubles/           # トラブルシューティング / 振り返り記録
└── refactoring/        # リファクタリング記録
```

---

## Features (機能仕様)

| ドキュメント | 説明 |
|------|------|
| [store-approval.md](./features/store-approval.md) | 店舗ライセンス審査および承認/拒否ワークフロー |
| [error-dashboard.md](./features/error-dashboard.md) | エラー統計および詳細ログ追跡ダッシュボードUI |
| [request-counter.md](./features/request-counter.md) | リアルタイムAPIリクエスト要約統計および詳細ログテーブルUI |
| [active-user-dashboard.md](./features/active-user-dashboard.md) | リアルタイムアクティブユーザー(同時接続者/DAU/MAU)監視ダッシュボードUI |

---

## Implementation (実装詳細)

| ドキュメント | 説明 |
|------|------|
| [architecture.md](./implementation/architecture.md) | プロジェクト構造およびデータフロー |
| [dual-env-proxy.md](./implementation/dual-env-proxy.md) | Dev/Prod 二重環境 Vite プロキシの実装 |
| [error-dashboard.md](./implementation/error-dashboard.md) | エラーダッシュボードのバックエンド連携およびUI実装詳細 |
| [request-counter.md](./implementation/request-counter.md) | リクエストカウンターのバックエンド連携およびUI実装詳細 |
| [active-user-tracking.md](./implementation/active-user-tracking.md) | リアルタイムアクティブユーザートラッキングのバックエンド連携およびUI実装詳細 |

---

## Decisions (技術決定)

| ドキュメント | 決定内容 |
|------|----------|
| [ADR-001-vite-proxy.md](./decisions/ADR-001-vite-proxy.md) | Vite 開発サーバープロキシ採用の理由 |
| [ADR-002-use-polling-for-error-dashboard.md](./decisions/ADR-002-use-polling-for-error-dashboard.md) | エラーダッシュボードにおけるHTTPポーリング採用の理由 |
| [ADR-003-request-counter-architecture.md](./decisions/ADR-003-request-counter-architecture.md) | 独自メトリクス収集およびリクエストカウンターアーキテクチャの採用 |
| [ADR-004-active-user-tracking.md](./decisions/ADR-004-active-user-tracking.md) | インメモリのスライディングウィンドウおよび日別アクティブユーザーコレクションを活用した接続者トラッキングの採用理由 |


---

## Troubles (トラブルシューティング / 振り返り)

| ドキュメント | 説明 |
|------|------|
| [001-lessons-learned.md](./troubles/001-lessons-learned.md) | MUIカスタムテーマ、Custom Hook分離、Viteビルド最適化の振り返り |

---

## Refactoring (リファクタリング)

*記録予定*
