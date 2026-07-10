import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { COLORS } from '../styles/colors';

function AuditLogPage() {
  const dummyLogs = [
    { time: '2026-07-10 22:30:15', actor: 'admin@yoyaku.com', action: '점포 승인', target: '스시 로드 (ID: 1042)', status: '성공' },
    { time: '2026-07-10 21:15:02', actor: 'manager@yoyaku.com', action: '로그인', target: '어드민 콘솔', status: '성공' },
    { time: '2026-07-10 19:40:59', actor: 'admin@yoyaku.com', action: '점포 거절', target: '맥 버거 (ID: 1024)', status: '성공' },
    { time: '2026-07-10 18:22:11', actor: 'system@yoyaku.com', action: '자동 차단', target: '비정상 트래픽 IP 192.168.1.4', status: '성공' }
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ListAltIcon sx={{ fontSize: 40, color: COLORS.warning, mr: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
          Audit Log
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: COLORS.textSecondary, mb: 4 }}>
        모든 관리자의 접근 내역 및 변경 행위를 로깅하는 감사 로그 대시보드입니다. (보안 진단 필수)
      </Typography>
      
      <TableContainer component={Paper} sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="audit logs">
          <TableHead sx={{ bgcolor: COLORS.border }}>
            <TableRow>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>일시</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>수행자</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>행동</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>대상</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>상태</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyLogs.map((log, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderBottom: `1px solid ${COLORS.border}` }}>
                <TableCell sx={{ color: COLORS.textSecondary }}>{log.time}</TableCell>
                <TableCell sx={{ color: COLORS.info }}>{log.actor}</TableCell>
                <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>{log.action}</TableCell>
                <TableCell sx={{ color: COLORS.textSecondary }}>{log.target}</TableCell>
                <TableCell sx={{ color: COLORS.success, fontWeight: 'bold' }}>{log.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AuditLogPage;
