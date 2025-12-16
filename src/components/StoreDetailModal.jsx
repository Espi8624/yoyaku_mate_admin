import React, { useState, useEffect } from 'react';
import { updateStoreStatus, getLicenseImageUrl } from '../api/adminService'; // API 서비스 import

function StoreDetailModal({ store, onClose, onUpdate }) {
  const [isLoading, setIsLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [licenseImageUrl, setLicenseImageUrl] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    // 비동기 함수를 정의하고 바로 호출합니다.
    const fetchLicenseImage = async () => {
      // store 객체와 license_image_url(파일 키)이 있는지 확인합니다.
      if (store && store.license_image_url) {
        setIsImageLoading(true);
        try {
          // adminService에 추가한 함수를 호출하여 임시 URL을 가져옵니다.
          const temporaryUrl = await getLicenseImageUrl(store.license_image_url);
          setLicenseImageUrl(temporaryUrl); // 받아온 URL을 상태에 저장합니다.
        } catch (error) {
          console.error("Failed to fetch license image URL", error);
          // 에러 발생 시 URL을 비워둡니다.
          setLicenseImageUrl('');
        } finally {
          setIsImageLoading(false);
        }
      } else {
        // 이미지 키가 없는 경우
        setIsImageLoading(false);
        setLicenseImageUrl('');
      }
    };

    fetchLicenseImage();
  }, [store]); // store prop이 변경될 때마다 이 효과를 다시 실행합니다.


  const handleApprove = async () => {
    if (!window.confirm(`${store.store_name}を承認しますか？`)) return;
    setIsLoading(true);
    try {
      await updateStoreStatus(store.store_id, 'APPROVED');
      alert('承認処理が完了しました。');
      onUpdate(); // 부모 컴포넌트에게 목록을 새로고침하라고 알림
      onClose();  // 모달 닫기
    } catch (error) {
      alert('承認処理に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason) {
      alert('拒否理由を入力してください。');
      return;
    }
    if (!window.confirm(`${store.store_name}を拒否しますか？`)) return;
    setIsLoading(true);
    try {
      await updateStoreStatus(store.store_id, 'REJECTED', rejectReason);
      alert('拒否処理が完了しました。');
      onUpdate();
      onClose();
    } catch (error) {
      alert('拒否処理に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>店舗詳細情報</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          {/* TODO: 여기에 가게의 모든 상세 정보를 표시합니다. */}
          <p><strong>店舗名:</strong> {store.store_name}</p>
          <p><strong>住所:</strong> {store.address}</p>
          <p><strong>電話番号:</strong> {store.phone}</p>
          <p><strong>申請日:</strong> {new Date(store.created_at).toLocaleString('ja-JP')}</p>

          <h4>営業許可証</h4>
          {isImageLoading ? (
            <div className="image-loading-placeholder">
              <p>イメージを読み込み中...</p> {/* 이미지를 불러오는 중... */}
            </div>
          ) : licenseImageUrl ? (
            // 이제 src에는 DB에서 직접 온 파일 키가 아닌,
            // 우리가 API로 받아온 임시 URL(licenseImageUrl 상태)을 사용합니다s.
            <img src={licenseImageUrl} alt="営業許可証" className="license-image" />
          ) : (
            <p>画像がありません。</p>
          )}

          {/* 반려 시에만 이유 입력란을 보여줍니다. */}
          {store.verification_status === 'PENDING_REVIEW' && (
            <div className="rejection-section">
              <h4>拒否理由 (必須)</h4>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="例：営業許可証の写真が不鮮明です。"
              />
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={handleReject} disabled={isLoading} className="reject-button">
            {isLoading ? '処理中...' : '拒否'}
          </button>
          <button onClick={handleApprove} disabled={isLoading} className="approve-button">
            {isLoading ? '処理中...' : '承認'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoreDetailModal;