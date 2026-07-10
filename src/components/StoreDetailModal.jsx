import React, { useState, useEffect } from 'react';
import { updateStoreStatus, getLicenseImageUrl } from '../api/adminService'; // APIサービスのimport

function StoreDetailModal({ store, onClose, onUpdate }) {
  const [isLoading, setIsLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [licenseImageUrl, setLicenseImageUrl] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    // 非同期関数を定義してすぐに呼び出します。
    const fetchLicenseImage = async () => {
      // storeオブジェクトとlicense_image_url(ファイルキー)があるか確認します。
      if (store && store.license_image_url) {
        setIsImageLoading(true);
        try {
          // adminServiceに追加した関数を呼び出して一時URLを取得します。
          const temporaryUrl = await getLicenseImageUrl(store.license_image_url);
          setLicenseImageUrl(temporaryUrl); // 取得したURLをステートに保存します。
        } catch (error) {
          console.error("Failed to fetch license image URL", error);
          // エラー発生時はURLを空にします。
          setLicenseImageUrl('');
        } finally {
          setIsImageLoading(false);
        }
      } else {
        // 画像キーがない場合
        setIsImageLoading(false);
        setLicenseImageUrl('');
      }
    };

    fetchLicenseImage();
  }, [store]); // store propが変更されるたびにこの効果を再実行します。


  const handleApprove = async () => {
    if (!window.confirm(`${store.store_name}を承認しますか？`)) return;
    setIsLoading(true);
    try {
      await updateStoreStatus(store.store_id, 'APPROVED', '');
      alert('承認処理が完了しました。');
      onUpdate(); // 親コンポーネントにリストを更新するよう通知
      onClose();  // モーダルを閉じる
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
          {/* 申請者情報 (一番上に表示、ダークモード対応) */}
          <div className="user-info-section" style={{ marginTop: '0', marginBottom: '16px', padding: '12px', backgroundColor: '#333', borderRadius: '4px', color: '#fff' }}>
            <h4 style={{ marginTop: 0, marginBottom: '8px', color: '#fff' }}>申請者情報</h4>
            <p style={{ margin: '4px 0' }}><strong>名前:</strong> {store.user_name || 'N/A'}</p>
            <p style={{ margin: '4px 0' }}><strong>メール:</strong> {store.user_email || 'N/A'}</p>
            <p style={{ margin: '4px 0' }}><strong>電話番号:</strong> {store.user_phone || 'N/A'}</p>
          </div>

          {/* TODO: ここに店舗の全ての詳細情報を表示します。 */}
          <p><strong>店舗名:</strong> {store.store_name}</p>
          <p><strong>住所:</strong> {store.address}</p>
          <p><strong>電話番号:</strong> {store.phone}</p>
          <p><strong>申請日:</strong> {new Date(store.created_at).toLocaleString('ja-JP')}</p>

          <h4>営業許可証</h4>
          {isImageLoading ? (
            <div className="image-loading-placeholder">
              <p>イメージを読み込み中...</p> {/* 画像を読み込み中... */}
            </div>
          ) : licenseImageUrl ? (
            // srcにはDBから直接来たファイルキーではなく、
            // APIで取得した一時URL(licenseImageUrlステート)を使用します。
            <img src={licenseImageUrl} alt="営業許可証" className="license-image" />
          ) : (
            <p>画像がありません。</p>
          )}

          {/* 拒否時のみ理由入力欄を表示します。 */}
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