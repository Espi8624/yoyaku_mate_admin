# 機能仕様書: SSE接続状態監視ダッシュボード (SSE Status Dashboard)

本ドキュメントは、 `yoyaku_mate_admin` 本社管理者ウェブに実装されたSSEブローカー接続状況監視ページの機能仕様を説明します。

> 作成日: 2026-07-15  
> 関連ドキュメント: [実装詳細書: SSE状態監視 (Admin)](../implementation/sse-monitoring.md), [実装詳細書: SSE状態監視 (サーバー)](../../../yoyaku_mate_server/docs/implementation/sse-monitoring.md)

---

## 1. 概要 (Overview)

SSE (Server-Sent Events) はサーバーからクライアントへの単方向通信方式であるため、サーバーがクライアントの切断を即座に検知できない構造的な特性があります。これにより、実際には切断されているにもかかわらずサーバー上では生存していると認識される **ゾンビ接続(Zombie Connection)** がメモリ上に蓄積される可能性があります。

本ダッシュボードは、管理者が2つのSSEブローカー（`Broker`（店舗用）、 `WaitingUserBroker`（個人用））の接続状況をリアルタイムで把握し、サーバーのHeartbeatによるゾンビ接続のクリア機能が正常に作動しているか監視できるようにします。

---

## 2. 画面構成および核心指標 (UI Metrics)

管理者ダッシュボードのサイドバーにある **SSE Status** メニューからアクセスでき、**5秒周期のHTTPポーリング**によって自動更新されます。

> SSE監視自体をSSEで実装すると、ネットワーク切断の発生時に監視ツールそのものが信頼性を失います。
> ポーリング方式は無状態（Stateless）であり自己回復するため、安定性を重視すべきダッシュボードに最適です。

### 2.1 上部ヘッダー (Health Badge)

* ページタイトル（`SSE Status`）の右側に、リアルタイムの健全性状態を示すバッジ（`Chip`）が表示されます。
  * 接続あり: 緑色の `HEALTHY` バッジ
  * 接続なし: 灰色の `IDLE` バッジ

### 2.2 要約指標カード (Metrics Cards)

* **TOTAL CONNECTIONS (全体有効接続数)**
  * **説明**: 2つのSSEブローカーの有効なチャネル数を合算した現在の総接続数です。
  * **反映基準**: `store_broker.total_connections + waiting_user_broker.total_connections`

* **CONNECTION HEALTH (接続健全性状態)**
  * **説明**: 全体接続数を基準に判定したブローカーの現在の稼働状態です。
  * **反映基準**: `total_connections > 0` → `HEALTHY` / `0` → `IDLE`
  * **サブテキスト**: HEALTHY時は「イベントストリームブロードキャスト正常動作中」、IDLE時は「現在有効なSSE接続なし」

* **STORE BROKER (店舗待ちリストブローカー)**
  * **説明**: 店舗待ちリストSSE（`/waiting-list/stream`）を購読中の接続状況です。
  * **表示項目**:
    * `total_connections`: 現在有効なチャネル数 (大文字表示)
    * `active_keys`: 購読中の店舗数
    * `avg_uptime_seconds`: チャネルの平均接続維持時間 (フォーマット: `Xh Ym` / `Xm Ys`)

* **USER BROKER (個別待ち顧客ブローカー)**
  * **説明**: 個別待ち顧客SSE（`/waiting-list/stream-user`）を購読中の接続状況です。
  * **表示項目**: STORE BROKERと同様の構造

---

## 3. 今後の高度化ロードマップ (Roadmap)

### 3.1 第2段階: 運用支援機能

* **ピーク接続数 (Peak Connections) の表示**
  * サーバー起動後に記録された最大同時接続数を表示し、サーバースケーリングの判断指標として活用します。

* **ブローカー別接続リストテーブル (Connection List)**
  * 現在接続中の店舗・ユーザーキー一覧と、各接続の継続時間をテーブル形式で一覧表示します。

### 3.2 第3段階: 能動的コントロール

* **強制切断ボタン**
  * 特定の店舗またはユーザーキーに対するSSE接続を、管理者がダッシュボードから強制的に切断・クリーンアップできる機能を追加します。

---

## 関連ドキュメント
- [実装詳細書: SSE状態監視 (Admin)](../implementation/sse-monitoring.md)
- [実装詳細書: SSE状態監視 (サーバー)](../../../yoyaku_mate_server/docs/implementation/sse-monitoring.md)
- [技術決定(ADR): SSE監視ダッシュボードにおける通信の分離](../../../yoyaku_mate_server/docs/decisions/ADR-006-sse-monitoring-polling.md)
