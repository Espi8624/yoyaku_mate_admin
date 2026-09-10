import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { COLORS } from '../styles/colors';
import { getActiveUserMetrics } from '../api/adminService';

// - 3枚とも共通の枠スタイルのため、毎レンダー3個ずつ新規生成せず固定オブジェクトを再利用する
const CARD_SX = {
  bgcolor: COLORS.surfaceLight,
  color: COLORS.textPrimary,
  border: `1px solid ${COLORS.borderLight}`,
  borderRadius: 2,
};

function ActiveUserPage() {
  const [metrics, setMetrics] = useState({
    current_active_users: 0,
    daily_active_users: 0,
    monthly_active_users: 0,
  });
  const metricsRef = useRef(metrics); // - setState要否判定用に直近値を同期参照する

  useEffect(() => {
    fetchData();
    // - 5秒周期でアクティブユーザーデータをポーリング更新
    // - タブが非表示の間はポーリングを止め、無駄なAPI呼び出し/再描画を避ける
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const data = await getActiveUserMetrics();
      if (data) {
        const next = {
          current_active_users: data.current_active_users ?? 0,
          daily_active_users: data.daily_active_users ?? 0,
          monthly_active_users: data.monthly_active_users ?? 0,
        };
        const prev = metricsRef.current;
        // - 前回と数値が同じならsetStateをスキップし、無駄な再描画を防ぐ
        if (
          prev.current_active_users !== next.current_active_users ||
          prev.daily_active_users !== next.daily_active_users ||
          prev.monthly_active_users !== next.monthly_active_users
        ) {
          metricsRef.current = next;
          setMetrics(next);
        }
      }
    } catch (err) {
      console.error("Failed to load active user metrics", err);
    }
  };

  // - 数値をカンマ形式(1,428)に変換するヘルパー関数
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PeopleIcon sx={{ fontSize: 40, color: COLORS.success, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          Active User
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 4 }}>
        現在プラットフォームに接続し、同時通信を行っているアクティブユーザーの指標です。
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={CARD_SX}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.success, fontWeight: 'bold', mb: 1 }}>
                CURRENT ACTIVE USERS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {formatNumber(metrics.current_active_users)}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                リアルタイムで同時接続中のユーザー数 (ウェブ/モバイル全体)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={CARD_SX}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.primary, fontWeight: 'bold', mb: 1 }}>
                DAILY ACTIVE USERS (DAU)
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {formatNumber(metrics.daily_active_users)}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                本日サービスを利用したユニークユーザー数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={CARD_SX}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.warning, fontWeight: 'bold', mb: 1 }}>
                MONTHLY ACTIVE USERS (MAU)
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {formatNumber(metrics.monthly_active_users)}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                過去30日間におけるアクティブユーザーの累積指標
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ActiveUserPage;
