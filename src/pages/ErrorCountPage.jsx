import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { COLORS } from '../styles/colors';

function ErrorCountPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ErrorOutlineIcon sx={{ fontSize: 40, color: COLORS.error, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          Error Count
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 4 }}>
        실시간 에러 모니터링 및 트래킹 시스템 대시보드입니다. 백엔드에서 전송되는 오류 로그를 파싱하여 실시간으로 경고합니다.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.error, fontWeight: 'bold', mb: 1 }}>
                CRITICAL ERRORS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                0
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                최근 1시간 동안 발생한 심각한 에러
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.warning, fontWeight: 'bold', mb: 1 }}>
                WARNINGS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                12
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                최근 1시간 동안 발생한 경고 로그
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.success, fontWeight: 'bold', mb: 1 }}>
                RESOLVED
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                100%
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                감지된 전체 오류 해결 비율
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ErrorCountPage;
