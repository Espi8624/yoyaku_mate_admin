import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import { COLORS } from '../styles/colors';
import { getRequestMetrics, getRequestLogs } from '../api/adminService';

function RequestCountPage() {
  const [metrics, setMetrics] = useState({ total_requests_24h: 0, success_rate: 100, peak_tps_1h: 0 });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchData();
    // - 5秒周期でリクエストデータをポーリング更新
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const metricData = await getRequestMetrics();
      const logData = await getRequestLogs();
      setMetrics(metricData || { total_requests_24h: 0, success_rate: 100, peak_tps_1h: 0 });
      setLogs(logData || []);
    } catch (err) {
      console.error("Failed to load request metrics", err);
    }
  };

  // - HTTPステータスコード別の表示チップのスタイルを決定する関数
  const getStatusChip = (statusCode) => {
    let chipColor = COLORS.success;
    if (statusCode >= 500) {
      chipColor = COLORS.error;
    } else if (statusCode >= 400) {
      chipColor = COLORS.warning;
    } else if (statusCode >= 300) {
      chipColor = COLORS.info;
    }

    return (
      <Chip
        label={statusCode}
        size="small"
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          color: chipColor,
          fontWeight: 'bold',
          border: `1px solid ${chipColor}`
        }}
      />
    );
  };

  // - 応答遅延速度に応じたテキスト強調関数 (500ms以上で警告)
  const getLatencyStyle = (responseTime) => {
    if (responseTime >= 1000) {
      return { color: COLORS.error, fontWeight: 'bold' };
    } else if (responseTime >= 500) {
      return { color: COLORS.warning, fontWeight: 'bold' };
    }
    return { color: COLORS.textSecondary };
  };

  // - エラーが発生したAPIリクエスト行の背景色を制御する関数
  const getRowBgColor = (statusCode) => {
    if (statusCode >= 500) {
      return 'rgba(231, 76, 60, 0.05)'; // - ごく薄い赤色のティント
    } else if (statusCode >= 400) {
      return 'rgba(243, 156, 18, 0.05)'; // - ごく薄いオレンジ色のティント
    }
    return 'transparent';
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* - ダッシュボードのタイトル領域 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SwapCallsIcon sx={{ fontSize: 40, color: COLORS.info, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          Request Dashboard
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 4 }}>
        サーバーへの流入トラフィックおよびAPIリクエスト回数を分析するリアルタイム監視ページです。
      </Typography>

      {/* - メトリクス要約カードのレイアウト */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.info, fontWeight: 'bold', mb: 1 }}>
                TOTAL REQUESTS (24H)
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {metrics.total_requests_24h.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                過去24時間に流入した総リクエスト数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.success, fontWeight: 'bold', mb: 1 }}>
                SUCCESS RATE
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {metrics.success_rate.toFixed(2)}%
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                正常に応答した割合 (Status 2xx/3xx)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, fontWeight: 'bold', mb: 1 }}>
                PEAK TPS (1H)
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {metrics.peak_tps_1h} <span style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>Req/Sec</span>
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                直近1時間における最大秒間リクエスト数(TPS)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* - リアルタイムAPIログリストテーブル */}
      <Typography variant="h6" sx={{ color: COLORS.textPrimary, mb: 2 }}>
        リアルタイムAPIリクエストログ (最新50件)
      </Typography>
      <TableContainer component={Paper} sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="request logs table">
          <TableHead sx={{ bgcolor: COLORS.border }}>
            <TableRow>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>日時</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>メソッド</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>APIパス</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>ステータス</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>応答速度</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>クライアントIP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <TableRow
                  key={log.id || index}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    borderBottom: `1px solid ${COLORS.border}`,
                    bgcolor: getRowBgColor(log.status_code),
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
                  }}
                >
                  <TableCell sx={{ color: COLORS.textSecondary }}>
                    {new Date(log.timestamp).toLocaleString('ja-JP')}
                  </TableCell>
                  <TableCell sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
                    {log.method}
                  </TableCell>
                  <TableCell sx={{ color: COLORS.textPrimary }}>
                    {log.path}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(log.status_code)}
                  </TableCell>
                  <TableCell sx={getLatencyStyle(log.response_time)}>
                    {log.response_time} ms
                  </TableCell>
                  <TableCell sx={{ color: COLORS.textMuted }}>
                    {log.client_ip}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: COLORS.textMuted, py: 4 }}>
                  ログデータがありません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default RequestCountPage;
