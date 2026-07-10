import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { drawerWidth } from './Sidebar';
import { Box, Typography, Chip } from '@mui/material';
import { COLORS } from '../styles/colors';

function Layout() {
  const isDev = import.meta.env.MODE === 'development';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: COLORS.background }}>
      {/* 좌측 고정 사이드바 */}
      <Sidebar />

      {/* 우측 콘텐츠 영역 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {/* 상단 관리 헤더 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            mb: 3,
            bgcolor: COLORS.surface,
            borderRadius: 2,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <Typography variant="h6" sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>
            Console Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
              Server Environment:
            </Typography>
            <Chip
              label={isDev ? 'DEVELOPMENT DB' : 'PRODUCTION DB'}
              color={isDev ? 'warning' : 'error'}
              size="small"
              sx={{ fontWeight: 'bold', borderRadius: 1.5 }}
            />
          </Box>
        </Box>

        {/* 하위 라우트 페이지 렌더링 영역 */}
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
