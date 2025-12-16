// src/pages/StoreApprovalPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { getStoresByStatus } from '../api/adminService'; // 실제 API 서비스 import
import StoreDetailModal from '../components/StoreDetailModal'; // 모달 import

function StoreApprovalPage() {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // ★★★ 1. 현재 선택된 가게와 모달 표시 여부를 관리할 상태 추가 ★★★
  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ★★★ 2. 데이터 로딩 로직을 useCallback으로 감싸서 최적화 ★★★
  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setError('');
     try {
    // ★★★ 1. console.log를 추가하여, 함수가 호출되는지 확인합니다. ★★★
    console.log("Fetching pending stores from API...");
    
    const pendingStores = await getStoresByStatus('PENDING_REVIEW');
    
    // ★★★ 2. API로부터 받은 데이터를 그대로 콘솔에 출력합니다. ★★★
    console.log("API Response:", pendingStores);
    
    setStores(pendingStores);
  } catch (err) {
    // ★★★ 3. 에러가 발생했다면, 어떤 에러인지 콘솔에 출력합니다. ★★★
    console.error("Failed to fetch stores:", err);
    setError('データの読み込みに失敗しました。');
  } finally {
    setIsLoading(false);
  }
  }, []); // 의존성 배열이 비어있으므로, 이 함수는 재생성되지 않습니다.

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // ★★★ 3. 모달을 열고 닫는 함수 ★★★
  const handleOpenModal = (store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
  };

  // ★★★ 4. 승인/반려 처리 후 목록을 새로고침하는 함수 ★★★
  const handleUpdate = () => {
    // 목록을 다시 불러옵니다.
    fetchStores();
  };

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '24px' }}>
      <h1>店舗承認管理</h1>
      <p>現在、{stores.length}件の承認待ちの申請があります。</p>
      
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
                  {/* ★★★ 5. 버튼을 누르면 모달을 열도록 수정 ★★★ */}
                  <button onClick={() => handleOpenModal(store)}>
                    詳細表示・処理
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '32px' }}>
                承認待ちの申請はありません。
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ★★★ 6. isModalOpen이 true일 때만 모달을 렌더링합니다. ★★★ */}
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