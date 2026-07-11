import React, { useState, useEffect, useCallback } from 'react';
import { getStoresByStatus } from '../api/adminService';
import StoreDetailModal from '../components/StoreDetailModal';
import { COLORS } from '../styles/colors';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

function StoreApprovalPage() {
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // ステータスタブ (PENDING_REVIEW / APPROVED / REJECTED)
  const [activeTab, setActiveTab] = useState('PENDING_REVIEW');

  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getStoresByStatus(activeTab);
      setStores(data);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
      setError('データの読み込みに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

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

  return (
    <Box sx={{ p: 4 }}>
      {/* タイトルおよび説明領域 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <VerifiedIcon sx={{ fontSize: 40, color: COLORS.primary, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          License Approval
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 4 }}>
        新規出店申請店舗から提出された営業許可証および証明書類の審査を行い、プラットフォームの承認処理を行います。
      </Typography>

      {/* ===== ステータスフィルタータブ ===== */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, borderBottom: `1px solid ${COLORS.border}`, pb: 0.5 }}>
        {[
          { status: 'PENDING_REVIEW', label: '申請中', color: COLORS.info },
          { status: 'APPROVED', label: '承認済み', color: COLORS.success },
          { status: 'REJECTED', label: '拒否済み', color: COLORS.error },
        ].map(({ status, label, color }) => {
          const isActive = activeTab === status;
          return (
            <Button
              key={status}
              onClick={() => handleTabChange(status)}
              sx={{
                color: isActive ? color : COLORS.textSecondary,
                fontWeight: isActive ? 'bold' : 'normal',
                borderBottom: isActive ? `2px solid ${color}` : 'none',
                borderRadius: 0,
                px: 3,
                py: 1.5,
                fontSize: '0.95rem',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.03)',
                }
              }}
            >
              {label}
            </Button>
          );
        })}
      </Box>

      {isLoading ? (
        <Typography sx={{ color: COLORS.textSecondary, p: 2 }}>読み込み中...</Typography>
      ) : error ? (
        <Typography sx={{ color: COLORS.error, p: 2 }}>{error}</Typography>
      ) : (
        <>
          <Typography sx={{ color: COLORS.textSecondary, mb: 2, fontSize: '0.95rem' }}>
            現在、{stores.length}件の{' '}
            {activeTab === 'PENDING_REVIEW'
              ? '承認待ちの申請'
              : activeTab === 'APPROVED'
              ? '承認済みの店舗'
              : '拒否された申請'}{' '}
            があります。
          </Typography>

          {/* ===== データテーブル ===== */}
          <TableContainer component={Paper} sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, borderRadius: 2, overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }} aria-label="approval table">
              <TableHead sx={{ bgcolor: COLORS.border }}>
                <TableRow>
                  <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold', fontSize: '0.95rem' }}>店舗名</TableCell>
                  <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold', fontSize: '0.95rem' }}>申請日</TableCell>
                  <TableCell align="right" sx={{ color: COLORS.textPrimary, fontWeight: 'bold', fontSize: '0.95rem', pr: 4 }}>アクション</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stores.length > 0 ? (
                  stores.map((store) => (
                    <TableRow 
                      key={store.store_id} 
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 }, 
                        borderBottom: `1px solid ${COLORS.border}`,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' }
                      }}
                    >
                      <TableCell sx={{ color: COLORS.textPrimary, fontWeight: '500' }}>{store.store_name}</TableCell>
                      <TableCell sx={{ color: COLORS.textSecondary }}>{new Date(store.created_at).toLocaleString('ja-JP')}</TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Button 
                          variant="outlined" 
                          onClick={() => handleOpenModal(store)}
                          sx={{ 
                            borderRadius: 1.5,
                            borderColor: COLORS.primary,
                            color: COLORS.primary,
                            textTransform: 'none',
                            fontWeight: '600',
                            px: 2,
                            '&:hover': {
                              borderColor: COLORS.primaryHover,
                              bgcolor: COLORS.primaryLight,
                            }
                          }}
                        >
                          詳細表示・処理
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 6, color: COLORS.textMuted }}>
                      データがありません。
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {isModalOpen && selectedStore && (
        <StoreDetailModal
          store={selectedStore}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
        />
      )}
    </Box>
  );
}

export default StoreApprovalPage;