import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { COLORS } from '../styles/colors';

function AuditLogPage() {
  const dummyLogs = [
    { time: '2026-07-10 22:30:15', actor: 'admin@yoyaku.com', action: '店舗承認', target: 'スシ ロード (ID: 1042)', status: '成功' },
    { time: '2026-07-10 21:15:02', actor: 'manager@yoyaku.com', action: 'ログイン', target: '管理コンソール', status: '成功' },
    { time: '2026-07-10 19:40:59', actor: 'admin@yoyaku.com', action: '店舗却下', target: 'マック バーガー (ID: 1024)', status: '成功' },
    { time: '2026-07-10 18:22:11', actor: 'system@yoyaku.com', action: '自動ブロック', target: '異常トラフィック IP 192.168.1.4', status: '成功' }
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
        すべての管理者のアクセス履歴および変更行為を記録する監査ログダッシュボードです。(セキュリティ診断必須)
      </Typography>
      
      <TableContainer component={Paper} sx={{ bgcolor: COLORS.surfaceLight, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}`, borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="audit logs">
          <TableHead sx={{ bgcolor: COLORS.border }}>
            <TableRow>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>日時</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>実行者</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>操作内容</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>対象</TableCell>
              <TableCell sx={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>ステータス</TableCell>
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
