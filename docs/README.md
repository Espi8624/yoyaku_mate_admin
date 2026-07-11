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


---

## Implementation (実装詳細)

| ドキュメント | 説明 |
|------|------|
| [architecture.md](./implementation/architecture.md) | プロジェクト構造およびデータフロー |
| [dual-env-proxy.md](./implementation/dual-env-proxy.md) | Dev/Prod 二重環境 Vite プロキシの実装 |

---

## Decisions (技術決定)

| ドキュメント | 決定内容 |
|------|----------|
| [ADR-001-vite-proxy.md](./decisions/ADR-001-vite-proxy.md) | Vite 開発サーバープロキシ採用の理由 |
| [ADR-002-use-polling-for-error-dashboard.md](./decisions/ADR-002-use-polling-for-error-dashboard.md) | エラーダッシュボードにおけるHTTPポーリング採用の理由 |


---

## Troubles (トラブルシューティング / 振り返り)

| ドキュメント | 説明 |
|------|------|
| [001-lessons-learned.md](./troubles/001-lessons-learned.md) | MUIカスタムテーマ、Custom Hook分離、Viteビルド最適化の振り返り |

---

## Refactoring (リファクタリング)

*記録予定*
