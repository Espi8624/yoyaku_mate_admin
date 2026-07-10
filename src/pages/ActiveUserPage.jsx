import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { COLORS } from '../styles/colors';

function ActiveUserPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PeopleIcon sx={{ fontSize: 40, color: COLORS.success, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          Active User
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 4 }}>
        현재 플랫폼에 접속하여 동시 통신 중인 활성 사용자 지표입니다.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.success, fontWeight: 'bold', mb: 1 }}>
                CURRENT ACTIVE USERS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                1,428
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                실시간 동시 접속 중인 유저 수 (웹/모바일 전체)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, fontWeight: 'bold', mb: 1 }}>
                DAILY ACTIVE USERS (DAU)
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                42,890
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                오늘 하루 동안 서비스를 이용한 순수 유저 수
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.warning, fontWeight: 'bold', mb: 1 }}>
                MONTHLY ACTIVE USERS (MAU)
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                512,400
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                최근 30일 기준 활성 사용자 누적 지표
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ActiveUserPage;
