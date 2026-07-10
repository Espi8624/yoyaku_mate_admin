import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';

// Pages
import StoreApprovalPage from './pages/StoreApprovalPage';
import ErrorCountPage from './pages/ErrorCountPage';
import RequestCountPage from './pages/RequestCountPage';
import ActiveUserPage from './pages/ActiveUserPage';
import SseStatusPage from './pages/SseStatusPage';
import ResponseTimePage from './pages/ResponseTimePage';
import AuditLogPage from './pages/AuditLogPage';
import SystemMetricsPage from './pages/SystemMetricsPage';
import DbMetricsPage from './pages/DbMetricsPage';
import AlertPage from './pages/AlertPage';

import { COLORS } from './styles/colors';

import './App.css';

// RUSTLE 어드민용 다크 테마 정의
const adminTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: COLORS.background,
      paper: COLORS.surface,
    },
    primary: {
      main: COLORS.primary,
    },
    success: {
      main: COLORS.success,
    },
    warning: {
      main: COLORS.warning,
    },
    error: {
      main: COLORS.error,
    },
    info: {
      main: COLORS.info,
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* 전체 대시보드 레이아웃을 감싼 중첩 라우트 */}
          <Route element={<Layout />}>
            {/* 기본 경로는 점포 인증서 승인 페이지로 리다이렉트 */}
            <Route path="/" element={<Navigate to="/store-approval" replace />} />
            
            {/* 각 사이드바 아이템에 매칭되는 모니터링 페이지 */}
            <Route path="/store-approval" element={<StoreApprovalPage />} />
            <Route path="/error-count" element={<ErrorCountPage />} />
            <Route path="/request-count" element={<RequestCountPage />} />
            <Route path="/active-user" element={<ActiveUserPage />} />
            <Route path="/sse-status" element={<SseStatusPage />} />
            <Route path="/response-time" element={<ResponseTimePage />} />
            <Route path="/audit-log" element={<AuditLogPage />} />
            <Route path="/system-metrics" element={<SystemMetricsPage />} />
            <Route path="/db-metrics" element={<DbMetricsPage />} />
            <Route path="/alert" element={<AlertPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;