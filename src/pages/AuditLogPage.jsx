import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
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

// - action/statusの組み合わせは種類が少ないため、Chip用sxオブジェクトを固定バリアントとして
//   モジュールスコープで一度だけ生成し再利用する(以前は行ごと・5秒ポーリングのたびに毎回新規生成していた)
const ACTION_CHIP_SX_CACHE = {};
function getActionChipSx(action) {
  if (!ACTION_CHIP_SX_CACHE[action]) {
    const color = ACTION_COLORS[action];
    ACTION_CHIP_SX_CACHE[action] = {
      bgcolor: color ? `${color}22` : `${COLORS.textMuted}22`,
      color: color || COLORS.textSecondary,
      fontWeight: 'bold',
      border: `1px solid ${color || COLORS.borderLight}`,
    };
  }
  return ACTION_CHIP_SX_CACHE[action];
}

const STATUS_CHIP_SX = {
  SUCCESS: {
    bgcolor: `${COLORS.success}22`,
    color: COLORS.success,
    fontWeight: 'bold',
    border: `1px solid ${COLORS.success}`,
  },
  OTHER: {
    bgcolor: `${COLORS.error}22`,
    color: COLORS.error,
    fontWeight: 'bold',
    border: `1px solid ${COLORS.error}`,
  },
};
const getStatusChipSx = (status) => (status === 'SUCCESS' ? STATUS_CHIP_SX.SUCCESS : STATUS_CHIP_SX.OTHER);

// - 全行共通で内容に依存しないため固定オブジェクトとして再利用
const TABLE_ROW_SX = {
  '&:last-child td': { border: 0 },
  borderBottom: `1px solid ${COLORS.border}`,
  '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
};

// - 取得結果が前回と実質同一かどうかをid列で判定 (5秒ポーリングで変化がない場合のsetState/再描画を回避)
function sameLogs(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if ((a[i].id ?? i) !== (b[i].id ?? i)) return false;
  }
  return true;
}

function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionFilter, setActionFilter] = useState('');
  const logsRef = useRef(logs); // - setState要否判定用に直近のlogsを同期的に参照する

  // - 監査ログ API 取得（5秒自動更新）
  const fetchLogs = useCallback(async () => {
    try {
      const data = await getAuditLogs();
      // - 前回と実質同一データならsetStateをスキップし、テーブル全行の無駄な再描画を防ぐ
      if (!sameLogs(logsRef.current, data || [])) {
        logsRef.current = data || [];
        setLogs(data || []);
      }
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

  // - クライアント側フィルタリング適用。logs/actionFilterが実際に変わった時のみ再計算する
  const filteredLogs = useMemo(
    () => logs.filter((log) => (actionFilter ? log.action === actionFilter : true)),
    [logs, actionFilter]
  );

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
                  <TableRow key={log.id || index} sx={TABLE_ROW_SX}>
                    <TableCell sx={{ color: COLORS.textSecondary, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Chip label={log.action || '-'} size="small" sx={getActionChipSx(log.action)} />
                    </TableCell>
                    <TableCell sx={{ color: COLORS.textPrimary }}>{log.target || '-'}</TableCell>
                    <TableCell>
                      <Chip label={log.status || '-'} size="small" sx={getStatusChipSx(log.status)} />
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
