import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, LinearProgress, CircularProgress } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import { COLORS } from '../styles/colors';
import { getSystemMetrics } from '../api/adminService';

function SystemMetricsPage() {
  const [metrics, setMetrics] = useState({ cpuUsage: 0, memoryUsage: 0, diskSpace: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      const data = await getSystemMetrics();
      if (data) {
        setMetrics({
          cpuUsage: data.cpuUsage || 0,
          memoryUsage: data.memoryUsage || 0,
          diskSpace: data.diskSpace || 0,
        });
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch system metrics:', err);
      setError('システムメトリクスの取得に失敗しました。');
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(); // 初期データ取得
    const interval = setInterval(fetchMetrics, 5000); // 5秒ごとにポーリング
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ color: COLORS.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <MemoryIcon sx={{ fontSize: 40, color: COLORS.primary, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          System Metrics
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 1 }}>
        サーバー（fly.io インスタンス）のリアルタイムハードウェアリソース使用状況を示します。
      </Typography>
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 3 }}>
          {error}
        </Typography>
      )}
      {!error && <Box sx={{ mb: 4 }} />}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, fontWeight: 'bold', mb: 1 }}>
                CPU USAGE
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                {metrics.cpuUsage}%
              </Typography>
              <LinearProgress variant="determinate" value={metrics.cpuUsage} sx={{ height: 8, borderRadius: 4, bgcolor: COLORS.border, '& .MuiLinearProgress-bar': { bgcolor: COLORS.primary } }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.info, fontWeight: 'bold', mb: 1 }}>
                MEMORY USAGE
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                {metrics.memoryUsage}%
              </Typography>
              <LinearProgress variant="determinate" value={metrics.memoryUsage} sx={{ height: 8, borderRadius: 4, bgcolor: COLORS.border, '& .MuiLinearProgress-bar': { bgcolor: COLORS.info } }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.warning, fontWeight: 'bold', mb: 1 }}>
                DISK SPACE
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                {metrics.diskSpace}%
              </Typography>
              <LinearProgress variant="determinate" value={metrics.diskSpace} sx={{ height: 8, borderRadius: 4, bgcolor: COLORS.border, '& .MuiLinearProgress-bar': { bgcolor: COLORS.warning } }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SystemMetricsPage;
