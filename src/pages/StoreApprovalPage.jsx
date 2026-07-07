// src/pages/StoreApprovalPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { getStoresByStatus, ENV_URLS } from '../api/adminService';
import StoreDetailModal from '../components/StoreDetailModal';

// 環境ごとの設定
const ENVIRONMENTS = [
  { key: 'dev', label: '開発 (Dev)', color: '#f39c12', description: ENV_URLS.dev },
  { key: 'prod', label: '本番 (Prod)', color: '#e74c3c', description: ENV_URLS.prod },
];

function StoreApprovalPage() {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 環境タブ (dev / prod)
  const [activeEnv, setActiveEnv] = useState('dev');

  // ステータスタブ (PENDING_REVIEW / APPROVED / REJECTED)
  const [activeTab, setActiveTab] = useState('PENDING_REVIEW');

  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getStoresByStatus(activeTab, activeEnv);
      setStores(data);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
      setError('データの読み込みに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, activeEnv]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // 環境変更時: ステータスタブをリセット
  const handleEnvChange = (envKey) => {
    setActiveEnv(envKey);
    setActiveTab('PENDING_REVIEW');
  };

  const handleTabChange = (status) => {
    setActiveTab(status);
  };

  const handleOpenModal = (store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
  };

  const handleUpdate = () => {
    fetchStores();
  };

  const currentEnv = ENVIRONMENTS.find((e) => e.key === activeEnv);

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>店舗承認管理</h1>

      {/* ===== 環境切り替えタブ ===== */}
      <div className="env-tab-bar">
        {ENVIRONMENTS.map((env) => (
          <button
            key={env.key}
            className={`env-tab-btn ${activeEnv === env.key ? 'env-tab-active' : ''}`}
            style={{ '--env-color': env.color }}
            onClick={() => handleEnvChange(env.key)}
          >
            <span className="env-tab-dot" />
            {env.label}
          </button>
        ))}
        <span className="env-url-badge">{currentEnv?.description}</span>
      </div>

      {/* ===== ステータスタブ ===== */}
      <div className="tabs" style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        {[
          { status: 'PENDING_REVIEW', label: '申請中', color: '#007bff' },
          { status: 'APPROVED', label: '承認済み', color: '#28a745' },
          { status: 'REJECTED', label: '拒否済み', color: '#dc3545' },
        ].map(({ status, label, color }) => (
          <button
            key={status}
            onClick={() => handleTabChange(status)}
            style={{
              padding: '10px 20px',
              marginRight: '5px',
              border: 'none',
              borderBottom: activeTab === status ? `2px solid ${color}` : 'none',
              backgroundColor: 'transparent',
              fontWeight: activeTab === status ? 'bold' : 'normal',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div>読み込み中...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <>
          <p>
            現在、{stores.length}件の
            {activeTab === 'PENDING_REVIEW'
              ? '承認待ちの申請'
              : activeTab === 'APPROVED'
              ? '承認済みの店舗'
              : '拒否された申請'}
            があります。
          </p>

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
                stores.map((store) => (
                  <tr key={store.store_id}>
                    <td>{store.store_name}</td>
                    <td>{new Date(store.created_at).toLocaleString('ja-JP')}</td>
                    <td>
                      <button onClick={() => handleOpenModal(store)}>詳細表示・処理</button>
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
        </>
      )}

      {isModalOpen && selectedStore && (
        <StoreDetailModal
          store={selectedStore}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
          environment={activeEnv}
        />
      )}
    </div>
  );
}

export default StoreApprovalPage;