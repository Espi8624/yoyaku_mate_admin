import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { COLORS } from '../styles/colors';
import { getErrorMetrics, getErrorLogs } from '../api/adminService';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function ErrorCountPage() {
  const [metrics, setMetrics] = useState({ count_500: 0, count_400: 0, count_db: 0, count_sse: 0 });
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // 5초마다 갱신
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const metricData = await getErrorMetrics();
      const logData = await getErrorLogs();
      setMetrics(metricData || { count_500: 0, count_400: 0, count_db: 0, count_sse: 0 });
      setLogs(logData || []);
    } catch (err) {
      console.error("Failed to load error metrics", err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ErrorOutlineIcon sx={{ fontSize: 40, color: COLORS.error, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          Error Dashboard
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 4 }}>
        リアルタイムエラー監視およびトラッキングシステムのダッシュボードです。
      </Typography>
      
      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.error, fontWeight: 'bold', mb: 1 }}>
                500 ERRORS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>{metrics.count_500}</Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>サーバー内部エラー</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.warning, fontWeight: 'bold', mb: 1 }}>
                400 ERRORS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>{metrics.count_400}</Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>不正なリクエスト</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.info, fontWeight: 'bold', mb: 1 }}>
                DB ERRORS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>{metrics.count_db}</Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>データベースエラー</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, fontWeight: 'bold', mb: 1 }}>
                SSE DISCONNECTS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>{metrics.count_sse}</Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>リアルタイム接続切断</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error Logs Table */}
      <Typography variant="h6" sx={{ color: COLORS.textPrimary, mb: 2 }}>最近のエラーログ</Typography>
      <TableContainer component={Paper} sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="error logs table">
          <TableHead sx={{ bgcolor: COLORS.border }}>
            <TableRow>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>日時</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>タイプ</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>API経路</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>メッセージ概要</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <TableRow 
                  key={index} 
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderBottom: `1px solid ${COLORS.border}`, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
                  onClick={() => setSelectedLog(log)}
                >
                  <TableCell sx={{ color: COLORS.textSecondary }}>{new Date(log.timestamp).toLocaleString('ja-JP')}</TableCell>
                  <TableCell sx={{ color: log.error_type === '500_INTERNAL_ERROR' ? COLORS.error : COLORS.warning, fontWeight: 'bold' }}>{log.error_type}</TableCell>
                  <TableCell sx={{ color: COLORS.textPrimary }}>{log.method} {log.path}</TableCell>
                  <TableCell sx={{ color: COLORS.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>{log.message}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: COLORS.textMuted, py: 4 }}>
                  最近のエラーはありません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail Modal */}
      <Modal
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        aria-labelledby="error-modal-title"
      >
        <Box sx={modalStyle}>
          {selectedLog && (
            <>
              <Typography id="error-modal-title" variant="h6" component="h2" sx={{ color: COLORS.error, mb: 2, fontWeight: 'bold' }}>
                {selectedLog.error_type}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>日時: {new Date(selectedLog.timestamp).toLocaleString('ja-JP')}</Typography>
                <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>API経路: {selectedLog.method} {selectedLog.path}</Typography>
                <Typography variant="body2" sx={{ color: COLORS.textSecondary }}>クライアントIP: {selectedLog.client_ip}</Typography>
              </Box>
              <Typography variant="body1" sx={{ color: COLORS.textPrimary, mb: 1, fontWeight: 'bold' }}>エラーメッセージ:</Typography>
              <Paper sx={{ p: 2, bgcolor: '#000', color: '#ff6b35', mb: 2, overflowX: 'auto', border: `1px solid ${COLORS.border}` }}>
                <code>{selectedLog.message}</code>
              </Paper>
              {selectedLog.stack_trace && (
                <>
                  <Typography variant="body1" sx={{ color: COLORS.textPrimary, mb: 1, fontWeight: 'bold' }}>Stack Trace:</Typography>
                  <Paper sx={{ p: 2, bgcolor: '#000', color: '#ccc', mb: 2, overflowX: 'auto', border: `1px solid ${COLORS.border}` }}>
                    <pre style={{ margin: 0, fontSize: '0.85rem' }}>{selectedLog.stack_trace}</pre>
                  </Paper>
                </>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setSelectedLog(null)} variant="contained" sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary }}>
                  閉じる
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default ErrorCountPage;
