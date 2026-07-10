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
        서버 응답 지연, 에러 급증 등의 장애 발생 시 슬랙/이메일 알림 임계치 조건을 설정합니다.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Slack Alarm Webhook
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 3 }}>
                현재 슬랙 채널 `#alert-rusui-monitoring` 에 에러 트리거 연동이 완료되어 있습니다.
              </Typography>
              <Button variant="contained" color="error" size="small">
                테스트 발송
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                임계치 설정 (Thresholds)
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textSecondary, mb: 1 }}>
                • 에러 비율 &gt; 1% (5분 평균)
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textSecondary, mb: 1 }}>
                • API 레이턴시 &gt; 500ms (5분 평균)
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textSecondary, mb: 3 }}>
                • CPU 사용량 &gt; 90% (1분 연속)
              </Typography>
              <Button variant="outlined" color="inherit" size="small" sx={{ borderColor: COLORS.border, color: COLORS.textPrimary, '&:hover': { borderColor: COLORS.borderLight } }}>
                설정 변경
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AlertPage;
