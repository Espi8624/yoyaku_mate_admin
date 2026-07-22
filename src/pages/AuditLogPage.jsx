import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import { COLORS } from '../styles/colors';
import { getAuditLogs } from '../api/adminService';

// - アクション種別ごと Chip カラーマッピング
const ACTION_COLORS = {
  STORE_APPROVED: COLORS.success,
  STORE_REJECTED: COLORS.error,
  STORE_PENDING_REVIEW: COLORS.warning,
};

// - アクション種別フィルターオプション
const ACTION_OPTIONS = [
  { value: '', label: 'すべてのアクション' },
  { value: 'STORE_APPROVED', label: 'STORE_APPROVED' },
  { value: 'STORE_REJECTED', label: 'STORE_REJECTED' },
  { value: 'STORE_PENDING_REVIEW', label: 'STORE_PENDING_REVIEW' },
];

// - タイムスタンプをローカル日時形式に変換
function formatTimestamp(ts) {
  if (!ts) return '-';
  const d = new Date(ts);
  return d.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
}

function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionFilter, setActionFilter] = useState('');

  // - 監査ログ API 取得（5秒自動更新）
  const fetchLogs = useCallback(async () => {
    try {
      const data = await getAuditLogs();
      setLogs(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
      setError('監査ログの取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  // - クライアント側フィルタリング適用
  const filteredLogs = logs.filter((log) => {
    const matchAction = actionFilter ? log.action === actionFilter : true;
    return matchAction;
  });

  return (
    <Box sx={{ p: 4 }}>
      {/* ヘッダー */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ListAltIcon sx={{ fontSize: 40, color: COLORS.warning, mr: 2 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
              Audit Log
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.textSecondary, mt: 0.5 }}>
              すべての管理者操作の履歴 — リアルタイム自動更新（5秒間隔）
            </Typography>
          </Box>
        </Box>
        <Tooltip title="更新">
          <IconButton
            onClick={fetchLogs}
            sx={{ color: COLORS.warning, border: `1px solid ${COLORS.borderLight}`, borderRadius: 1 }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* フィルターエリア */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel sx={{ color: COLORS.textSecondary }}>アクション</InputLabel>
          <Select
            id="audit-action-filter"
            value={actionFilter}
            label="アクション"
            onChange={(e) => setActionFilter(e.target.value)}
            sx={{
              color: COLORS.textPrimary,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.borderLight },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.warning },
              '& .MuiSvgIcon-root': { color: COLORS.textSecondary },
            }}
          >
            {ACTION_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography
          variant="body2"
          sx={{ color: COLORS.textMuted, alignSelf: 'center', ml: 'auto' }}
        >
          {filteredLogs.length}件表示 / 全{logs.length}件
        </Typography>
      </Box>

      {/* ローディング / エラー / テーブル */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: COLORS.warning }} />
        </Box>
      ) : error ? (
        <Typography sx={{ color: COLORS.error, textAlign: 'center', py: 4 }}>{error}</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            bgcolor: COLORS.surfaceLight,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Table sx={{ minWidth: 750 }} aria-label="audit logs table">
            <TableHead sx={{ bgcolor: COLORS.border }}>
              <TableRow>
                <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>日時</TableCell>
                <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>操作内容</TableCell>
                <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>対象</TableCell>
                <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>ステータス</TableCell>
                <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>詳細</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', color: COLORS.textMuted, py: 5 }}>
                    監査ログがありません。
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log, index) => (
                  <TableRow
                    key={log.id || index}
                    sx={{
                      '&:last-child td': { border: 0 },
                      borderBottom: `1px solid ${COLORS.border}`,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
                    }}
                  >
                    <TableCell sx={{ color: COLORS.textSecondary, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.action || '-'}
                        size="small"
                        sx={{
                          bgcolor: ACTION_COLORS[log.action]
                            ? `${ACTION_COLORS[log.action]}22`
                            : `${COLORS.textMuted}22`,
                          color: ACTION_COLORS[log.action] || COLORS.textSecondary,
                          fontWeight: 'bold',
                          border: `1px solid ${ACTION_COLORS[log.action] || COLORS.borderLight}`,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: COLORS.textPrimary }}>{log.target || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.status || '-'}
                        size="small"
                        sx={{
                          bgcolor: log.status === 'SUCCESS'
                            ? `${COLORS.success}22`
                            : `${COLORS.error}22`,
                          color: log.status === 'SUCCESS' ? COLORS.success : COLORS.error,
                          fontWeight: 'bold',
                          border: `1px solid ${log.status === 'SUCCESS' ? COLORS.success : COLORS.error}`,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: COLORS.textMuted, fontSize: '0.8rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.details || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default AuditLogPage;
