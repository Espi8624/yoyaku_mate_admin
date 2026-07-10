import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import { COLORS } from '../styles/colors';

function RequestCountPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SwapCallsIcon sx={{ fontSize: 40, color: COLORS.info, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          Request Count
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 4 }}>
        서버 유입 트래픽 및 API 호출 요청 횟수를 분석하는 실시간 모니터링 페이지입니다.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.info, fontWeight: 'bold', mb: 1 }}>
                TOTAL REQUESTS (24H)
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                1,245,892
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                지난 24시간 동안 유입된 총 요청 수
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.success, fontWeight: 'bold', mb: 1 }}>
                SUCCESS RATE
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                99.98%
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                성공적으로 처리된 응답 비율 (Status 2xx/3xx)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.error, fontWeight: 'bold', mb: 1 }}>
                PEAK TPS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                450 <span style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>Req/Sec</span>
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                최근 1시간 내 최대 초당 처리 트래픽
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RequestCountPage;
