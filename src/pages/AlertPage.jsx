import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { COLORS } from '../styles/colors';

function AlertPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <WarningIcon sx={{ fontSize: 40, color: COLORS.error, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          Alert Settings
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 4 }}>
        サーバーの応答遅延、エラー急増などの障害発生時に、Slack/メール通知の閾値条件を設定します。
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Slack Alarm Webhook
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 3 }}>
                現在、Slackチャンネル「#alert-rusui-monitoring」へのエラートリガー連携が完了しています。
              </Typography>
              <Button variant="contained" color="error" size="small">
                テスト送信
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                閾値設定 (Thresholds)
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textSecondary, mb: 1 }}>
                • エラー率 &gt; 1% (5分平均)
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textSecondary, mb: 1 }}>
                • APIレイテンシ &gt; 500ms (5分平均)
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textSecondary, mb: 3 }}>
                • CPU使用率 &gt; 90% (1分連続)
              </Typography>
              <Button variant="outlined" color="inherit" size="small" sx={{ borderColor: COLORS.border, color: COLORS.textPrimary, '&:hover': { borderColor: COLORS.borderLight } }}>
                設定変更
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AlertPage;
