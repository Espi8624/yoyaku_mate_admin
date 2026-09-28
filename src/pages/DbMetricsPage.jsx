import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress, Alert, Button } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import { COLORS } from '../styles/colors';
import { getDbMetrics } from '../api/adminService';
import { useNavigate } from 'react-router-dom';

// - 3枚とも共通の枠スタイルのため、毎レンダー3個ずつ新規生成せず固定オブジェクトを再利用する
const CARD_SX = {
  bgcolor: COLORS.surfaceLight,
  color: COLORS.textPrimary,
  border: `1px solid ${COLORS.borderLight}`,
  borderRadius: 2,
};

function DbMetricsPage() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    active_connections: 0,
    database_size_mb: 0,
    slow_queries_24h: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const metricsRef = useRef(metrics); // - setState要否判定用に直近値を同期参照する

  useEffect(() => {
    let isMounted = true;

    const fetchMetrics = async () => {
      try {
        const data = await getDbMetrics();
        if (isMounted && data) {
          const prev = metricsRef.current;
          // - 前回と数値が同じならsetStateをスキップし、無駄な再描画を防ぐ
          if (
            prev.active_connections !== data.active_connections ||
            prev.database_size_mb !== data.database_size_mb ||
            prev.slow_queries_24h !== data.slow_queries_24h
          ) {
            metricsRef.current = data;
            setMetrics(data);
          }
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch DB metrics:", err);
          setError("データベース指標の読み込みに失敗しました。");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMetrics();
    // - タブが非表示の間はポーリングを止め、無駄なAPI呼び出し/再描画を避ける
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') fetchMetrics();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: COLORS.primary }} />
      </Box>
    );
  }

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

      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={CARD_SX}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.success, fontWeight: 'bold', mb: 1 }}>
                ACTIVE CONNECTIONS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {metrics.active_connections}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                現在アクティブなMongoDBコネクションプール数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={CARD_SX}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.info, fontWeight: 'bold', mb: 1 }}>
                DATABASE SIZE
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {metrics.database_size_mb.toFixed(2)} <span style={{ fontSize: '1.2rem', fontWeight: 'normal' }}>MB</span>
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                MongoDBの物理ディスク占有容量 (Storage Size)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={CARD_SX}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: COLORS.error, fontWeight: 'bold', mb: 1 }}>
                SLOW QUERIES (24H)
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {metrics.slow_queries_24h}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                過去24時間で200msを超過したリクエスト数
              </Typography>
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={() => navigate('/response-time')}
                  sx={{ fontWeight: 'bold' }}
                >
                  詳細を見る
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DbMetricsPage;

