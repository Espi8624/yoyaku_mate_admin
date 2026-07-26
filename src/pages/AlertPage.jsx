import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Alert } from '@mui/material';
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
        サーバーの応答遅延、エラー急増などの障害発生時に、Slackやメールでの通知を行うための設定画面です。
      </Typography>

      <Alert severity="info" sx={{ mb: 4, bgcolor: 'rgba(2, 136, 209, 0.1)', color: '#0288d1', border: '1px solid rgba(2, 136, 209, 0.3)' }}>
        この機能は現在開発中（TODO）です。将来のアップデートでSlack Webhookおよび外部メールAPI（Resend等）と連動する予定です。
      </Alert>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Notification Webhook (Slack / Email)
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 3 }}>
                ※ 連携先チャンネルや宛先の設定項目は、今後のアップデートで追加されます。
              </Typography>
              <Button variant="contained" color="error" size="small" disabled>
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
              <Button variant="outlined" color="inherit" size="small" disabled sx={{ borderColor: COLORS.border, color: COLORS.textPrimary, '&:hover': { borderColor: COLORS.borderLight } }}>
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
