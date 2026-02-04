// src/pages/StoreApprovalPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { getStoresByStatus } from '../api/adminService'; // 実際のAPIサービスのimport
import StoreDetailModal from '../components/StoreDetailModal'; // モーダルのimport

function StoreApprovalPage() {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ★★★ 1. タブの状態管理 (デフォルト: PENDING_REVIEW) ★★★
  const [activeTab, setActiveTab] = useState('PENDING_REVIEW');
  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ★★★ 2. データ読み込みロジックをタブの状態に応じて変更 ★★★
  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      console.log(`Fetching stores with status: ${activeTab}...`);

      const stores = await getStoresByStatus(activeTab);

      console.log("API Response:", stores);

      setStores(stores);
    } catch (err) {
      console.error("Failed to fetch stores:", err);
      setError('データの読み込みに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]); // activeTabが変更されるたびに関数を再生成

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // ★★★ 3. モーダルを開閉する関数 ★★★
  const handleOpenModal = (store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
  };

  // ★★★ 4. 承認/拒否処理後にリストを更新する関数 ★★★
  const handleUpdate = () => {
    // リストを再読み込みします。
    fetchStores();
  };

  // タブ変更ハンドラー
  const handleTabChange = (status) => {
    setActiveTab(status);
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '24px' }}>
      <h1>店舗承認管理</h1>

      {/* タブナビゲーション */}
      <div className="tabs" style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        <button
          onClick={() => handleTabChange('PENDING_REVIEW')}
          style={{
            padding: '10px 20px',
            marginRight: '5px',
            border: 'none',
            borderBottom: activeTab === 'PENDING_REVIEW' ? '2px solid #007bff' : 'none',
            backgroundColor: 'transparent',
            fontWeight: activeTab === 'PENDING_REVIEW' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          申請中
        </button>
        <button
          onClick={() => handleTabChange('APPROVED')}
          style={{
            padding: '10px 20px',
            marginRight: '5px',
            border: 'none',
            borderBottom: activeTab === 'APPROVED' ? '2px solid #28a745' : 'none',
            backgroundColor: 'transparent',
            fontWeight: activeTab === 'APPROVED' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          承認済み
        </button>
        <button
          onClick={() => handleTabChange('REJECTED')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderBottom: activeTab === 'REJECTED' ? '2px solid #dc3545' : 'none',
            backgroundColor: 'transparent',
            fontWeight: activeTab === 'REJECTED' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
        >
          拒否済み
        </button>
      </div>

      <p>現在、{stores.length}件の
        {activeTab === 'PENDING_REVIEW' ? '承認待ちの申請' :
          activeTab === 'APPROVED' ? '承認済みの店舗' : '拒否された申請'}
        があります。</p>

      <table className="approval-table">
        <thead>
          <tr>
            <th>店舗名</th>
            <th>申請日</th>
            <th>アクション</th>
          </tr>
        </thead>
        <tbody>
          {stores.length > 0 ? (
            stores.map(store => (
              <tr key={store.store_id}>
                <td>{store.store_name}</td>
                <td>{new Date(store.created_at).toLocaleString('ja-JP')}</td>
                <td>
                  <button onClick={() => handleOpenModal(store)}>
                    詳細表示・処理
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '32px' }}>
                データがありません。
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ★★★ 6. isModalOpenがtrueの時のみモーダルをレンダリングします。 ★★★ */}
      {isModalOpen && selectedStore && (
        <StoreDetailModal
          store={selectedStore}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default StoreApprovalPage;