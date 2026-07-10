import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { COLORS } from '../styles/colors';

function ResponseTimePage() {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AccessTimeIcon sx={{ fontSize: 40, color: COLORS.primary, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          Response Time
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 4 }}>
        실시간 API 레이턴시 및 엔드포인트 응답 속도 성능 지표입니다.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.success, fontWeight: 'bold', mb: 1 }}>
                AVERAGE LATENCY
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                45 <span style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>ms</span>
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                최근 5분간 처리된 API 평균 응답 속도
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.warning, fontWeight: 'bold', mb: 1 }}>
                P99 LATENCY
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                180 <span style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>ms</span>
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                상위 1% 요청의 최대 레이턴시 범위
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.error, fontWeight: 'bold', mb: 1 }}>
                SLOWEST API
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1, fontSize: '1.1rem', color: COLORS.textPrimary }}>
                GET /api/admin/stores
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted, mt: 1.5 }}>
                최근 가장 오랜 응답 시간을 소요한 엔드포인트
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ResponseTimePage;
