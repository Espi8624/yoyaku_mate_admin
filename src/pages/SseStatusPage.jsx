import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import { COLORS } from '../styles/colors';
import { getSseMetrics } from '../api/adminService';

function SseStatusPage() {
  const [metrics, setMetrics] = useState({
    store_broker: { active_keys: 0, total_connections: 0, avg_uptime_seconds: 0 },
    waiting_user_broker: { active_keys: 0, total_connections: 0, avg_uptime_seconds: 0 },
    total_connections: 0,
    health: 'IDLE',
  });

  useEffect(() => {
    fetchData();
    // 5秒周期でSSEステータスをポーリングアップデート
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const data = await getSseMetrics();
      if (data) setMetrics(data);
    } catch (err) {
      console.error('Failed to load SSE metrics', err);
    }
  };

  // 秒単位のアップタイムを読みやすい形式に変換（例: 1h 23m / 45m 12s）
  const formatUptime = (seconds) => {
    if (seconds <= 0) return '-';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const isHealthy = metrics.health === 'HEALTHY';

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsInputAntennaIcon sx={{ fontSize: 40, color: COLORS.warning, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          SSE Status
        </Typography>
        <Chip
          label={metrics.health}
          size="small"
          sx={{
            ml: 2,
            fontWeight: 'bold',
            bgcolor: isHealthy ? COLORS.success : COLORS.textMuted,
            color: '#fff',
          }}
        />
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 4 }}>
        リアルタイムデータの同期を行うSSEブローカーの接続状況およびゾンビ接続のクリア状態を監視します。
      </Typography>

      <Grid container spacing={3}>
        {/* 全体接続数 */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.warning, fontWeight: 'bold', mb: 1 }}>
                TOTAL CONNECTIONS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {metrics.total_connections.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                両ブローカーの合算アクティブチャネル数
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 接続健全性状態 */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: isHealthy ? COLORS.success : COLORS.textMuted, fontWeight: 'bold', mb: 1 }}>
                CONNECTION HEALTH
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: isHealthy ? COLORS.success : COLORS.textMuted }}>
                {metrics.health}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                {isHealthy ? 'イベントストリームブロードキャスト正常動作中' : '現在有効なSSE接続なし'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 店舗待ちリストブローカー */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, fontWeight: 'bold', mb: 1 }}>
                STORE BROKER
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {metrics.store_broker.total_connections.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 0.5 }}>
                店舗 {metrics.store_broker.active_keys}件購読中
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                平均維持: {formatUptime(metrics.store_broker.avg_uptime_seconds)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 個別待ち顧客ブローカー */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.success, fontWeight: 'bold', mb: 1 }}>
                USER BROKER
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {metrics.waiting_user_broker.total_connections.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 0.5 }}>
                ユーザーキー {metrics.waiting_user_broker.active_keys}件購読中
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                平均維持: {formatUptime(metrics.waiting_user_broker.avg_uptime_seconds)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SseStatusPage;

