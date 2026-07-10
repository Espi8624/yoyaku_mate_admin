import React from 'react';
import { Box, Typography, Card, CardContent, Grid, LinearProgress } from '@mui/material';
import MemoryIcon from '@mui/icons-material/Memory';
import { COLORS } from '../styles/colors';

function SystemMetricsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <MemoryIcon sx={{ fontSize: 40, color: COLORS.primary, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          System Metrics
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 4 }}>
        サーバー（fly.io インスタンス）のリアルタイムハードウェアリソース使用状況を示します。
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, fontWeight: 'bold', mb: 1 }}>
                CPU USAGE
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                14.2%
              </Typography>
              <LinearProgress variant="determinate" value={14.2} sx={{ height: 8, borderRadius: 4, bgcolor: COLORS.border, '& .MuiLinearProgress-bar': { bgcolor: COLORS.primary } }} />
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
                45.8%
              </Typography>
              <LinearProgress variant="determinate" value={45.8} sx={{ height: 8, borderRadius: 4, bgcolor: COLORS.border, '& .MuiLinearProgress-bar': { bgcolor: COLORS.info } }} />
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
                21.4%
              </Typography>
              <LinearProgress variant="determinate" value={21.4} sx={{ height: 8, borderRadius: 4, bgcolor: COLORS.border, '& .MuiLinearProgress-bar': { bgcolor: COLORS.warning } }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SystemMetricsPage;
