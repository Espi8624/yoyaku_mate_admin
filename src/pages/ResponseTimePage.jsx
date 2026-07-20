import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { COLORS } from '../styles/colors';
import { getResponseTimeMetrics } from '../api/adminService';

// - レイテンシ値に基づき、閾値別の表示色を返す
// - < 100ms: 緑 / 100~500ms: 橙 / > 500ms: 赤
const getLatencyColor = (ms) => {
  if (ms === 0 || ms === null || ms === undefined) return COLORS.textMuted;
  if (ms < 100) return COLORS.success;
  if (ms < 500) return COLORS.warning;
  return COLORS.error;
};

// - HTTP メソッド別のバッジ色を返す
const getMethodColor = (method) => {
  switch (method?.toUpperCase()) {
    case 'GET':    return COLORS.info;
    case 'POST':   return COLORS.success;
    case 'PATCH':  return COLORS.warning;
    case 'DELETE': return COLORS.error;
    default:       return COLORS.textMuted;
  }
};

// - 時間範囲の選択肢定義
const RANGE_OPTIONS = [
  { value: '5m',  label: '直近5分' },
  { value: '1h',  label: '直近1時間' },
  { value: '24h', label: '直近24時間' },
];

function ResponseTimePage() {
  const [range, setRange] = useState('1h');
  const [summary, setSummary] = useState({ avg_ms: 0, p95_ms: 0, p99_ms: 0, error_rate_pct: 0 });
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const data = await getResponseTimeMetrics(range);
      setSummary(data?.summary || { avg_ms: 0, p95_ms: 0, p99_ms: 0, error_rate_pct: 0 });
      setEndpoints(data?.endpoints || []);
    } catch (err) {
      console.error('Failed to load response time metrics', err);
    } finally {
      setLoading(false);
    }
  }, [range]);

  // - 選択範囲変更時とマウント時に即時フェッチ、以降5秒ポーリング
  useEffect(() => {
    setLoading(true);
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRangeChange = (_event, newRange) => {
    if (newRange !== null) setRange(newRange);
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* ヘッダー */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <AccessTimeIcon sx={{ fontSize: 40, color: COLORS.primary, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          Response Time
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 3 }}>
        リアルタイムのAPIレイテンシおよびエンドポイント応答速度のパフォーマンス指標です。
      </Typography>

      {/* 時間範囲タブ */}
      <Box sx={{ mb: 4 }}>
        <ToggleButtonGroup
          value={range}
          exclusive
          onChange={handleRangeChange}
          size="small"
          sx={{
            gap: 0.75,
            // - MUI 기본 인접 버튼 border 합치기 동작을 해제하고 각 버튼을 독립적으로 처리
            '& .MuiToggleButtonGroup-grouped': {
              border: `1px solid ${COLORS.borderLight} !important`,
              borderRadius: '6px !important',
              mx: 0,
            },
            '& .MuiToggleButton-root': {
              color: COLORS.textSecondary,
              px: 2.5,
              py: 0.75,
              fontWeight: 'bold',
              fontSize: '0.8rem',
              '&.Mui-selected': {
                color: COLORS.primary,
                backgroundColor: COLORS.primaryLight,
                borderColor: `${COLORS.primary} !important`,
                '&:hover': { backgroundColor: COLORS.primaryLightHover },
              },
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
            },
          }}
        >
          {RANGE_OPTIONS.map((opt) => (
            <ToggleButton key={opt.value} value={opt.value}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* サマリーカード (4枚) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* AVG LATENCY */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.success, fontWeight: 'bold', mb: 1 }}>
                AVG LATENCY
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: COLORS.textPrimary, mb: 1 }}>
                {loading ? '—' : summary.avg_ms}
                <span style={{ fontSize: '1.2rem', fontWeight: 'normal', marginLeft: 4 }}>ms</span>
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>全リクエストの平均応答時間</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* P95 LATENCY */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.warning, fontWeight: 'bold', mb: 1 }}>
                P95 LATENCY
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 'bold', color: getLatencyColor(summary.p95_ms), mb: 1 }}
              >
                {loading ? '—' : summary.p95_ms}
                <span style={{ fontSize: '1.2rem', fontWeight: 'normal', marginLeft: 4 }}>ms</span>
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>上位5%リクエストのレイテンシ</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* P99 LATENCY */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.error, fontWeight: 'bold', mb: 1 }}>
                P99 LATENCY
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 'bold', color: getLatencyColor(summary.p99_ms), mb: 1 }}
              >
                {loading ? '—' : summary.p99_ms}
                <span style={{ fontSize: '1.2rem', fontWeight: 'normal', marginLeft: 4 }}>ms</span>
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>上位1%リクエストのレイテンシ</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* ERROR RATE */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.info, fontWeight: 'bold', mb: 1 }}>
                ERROR RATE
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: summary.error_rate_pct > 5 ? COLORS.error : summary.error_rate_pct > 1 ? COLORS.warning : COLORS.success,
                  mb: 1,
                }}
              >
                {loading ? '—' : summary.error_rate_pct}
                <span style={{ fontSize: '1.2rem', fontWeight: 'normal', marginLeft: 4 }}>%</span>
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>4xx / 5xx エラーの割合</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* エンドポイント別レイテンシテーブル */}
      <Typography variant="h6" sx={{ color: COLORS.textPrimary, mb: 2 }}>
        遅いエンドポイント Top 10
        <Typography component="span" variant="body2" sx={{ color: COLORS.textMuted, ml: 1.5 }}>
          — avg_ms 降順
        </Typography>
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          bgcolor: COLORS.surfaceLight,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 750 }} aria-label="endpoint latency table">
          <TableHead sx={{ bgcolor: COLORS.border }}>
            <TableRow>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold', width: 90 }}>METHOD</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>ENDPOINT</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold', width: 100 }} align="right">AVG</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold', width: 100 }} align="right">P95</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold', width: 100 }} align="right">P99</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold', width: 100 }} align="right">REQUESTS</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold', width: 100 }} align="right">ERROR %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {endpoints.length > 0 ? (
              endpoints.map((ep, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    borderBottom: `1px solid ${COLORS.border}`,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
                  }}
                >
                  {/* HTTP メソッドバッジ */}
                  <TableCell>
                    <Chip
                      label={ep.method}
                      size="small"
                      sx={{
                        color: getMethodColor(ep.method),
                        borderColor: getMethodColor(ep.method),
                        bgcolor: 'transparent',
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        height: 22,
                      }}
                      variant="outlined"
                    />
                  </TableCell>

                  {/* エンドポイントパス */}
                  <TableCell sx={{ color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {ep.path}
                  </TableCell>

                  {/* AVG */}
                  <TableCell align="right" sx={{ color: getLatencyColor(ep.avg_ms), fontWeight: 'bold' }}>
                    {ep.avg_ms} ms
                  </TableCell>

                  {/* P95 */}
                  <TableCell align="right" sx={{ color: getLatencyColor(ep.p95_ms), fontWeight: 'bold' }}>
                    {ep.p95_ms} ms
                  </TableCell>

                  {/* P99 */}
                  <TableCell align="right" sx={{ color: getLatencyColor(ep.p99_ms), fontWeight: 'bold' }}>
                    {ep.p99_ms} ms
                  </TableCell>

                  {/* リクエスト件数 */}
                  <TableCell align="right" sx={{ color: COLORS.textSecondary }}>
                    {ep.count?.toLocaleString()}
                  </TableCell>

                  {/* エラー率 */}
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 'bold',
                      color: ep.error_pct > 5 ? COLORS.error : ep.error_pct > 1 ? COLORS.warning : COLORS.success,
                    }}
                  >
                    {ep.error_pct}%
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: COLORS.textMuted, py: 5 }}>
                  {loading ? 'データを読み込み中...' : '対象期間内のリクエストデータがありません。'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* TODO: レイテンシ推移チャート (時間別 avg/p95/p99 折れ線グラフ) — 追って実装予定 */}
    </Box>
  );
}

export default ResponseTimePage;
