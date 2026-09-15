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
        サーバーの応答遅延、エラー急増などの障害発生時に、Slackへ通知を行う機能です。
      </Typography>

      <Alert severity="info" sx={{ mb: 4, bgcolor: 'rgba(2, 136, 209, 0.1)', color: '#0288d1', border: '1px solid rgba(2, 136, 209, 0.3)' }}>
        サーバー側で下記の閾値監視・Slack通知は稼働中です。Webhook URLはサーバー環境変数(SLACK_WEBHOOK_URL)でのみ設定でき、この画面からの変更にはまだ対応していません。メール通知は未実装です。
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Notification Webhook (Slack)
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 3 }}>
                ※ Webhook URLの発行・設定はfly secrets(SLACK_WEBHOOK_URL)で行います。テスト送信ボタンは今後のアップデートで対応予定です。
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
