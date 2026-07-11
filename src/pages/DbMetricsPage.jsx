import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import { COLORS } from '../styles/colors';

function DbMetricsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <StorageIcon sx={{ fontSize: 40, color: COLORS.primary, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          DB Metrics
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 4 }}>
        MongoDB Atlas クラスタのリアルタイムデータベースエンジン性能およびクエリ統計の指標です。
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.success, fontWeight: 'bold', mb: 1 }}>
                ACTIVE CONNECTIONS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                15
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                現在アクティブなMongoDBコネクションプール数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.info, fontWeight: 'bold', mb: 1 }}>
                DATABASE SIZE
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                1.42 <span style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>GB</span>
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                MongoDBの物理ディスク占有容量
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.borderLight}`, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.error, fontWeight: 'bold', mb: 1 }}>
                SLOW QUERIES (24H)
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                0
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                200msを超過したスロークエリの発生回数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DbMetricsPage;
