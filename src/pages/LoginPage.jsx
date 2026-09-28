import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { COLORS } from '../styles/colors';
import { adminLogin } from '../api/adminService';
import { setAdminToken } from '../auth/adminAuth';

function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = await adminLogin(password);
      setAdminToken(token);
      // - ログイン前にアクセスしようとしていたパスがあればそちらへ、なければデフォルト画面へ遷移
      const redirectTo = location.state?.from || '/store-approval';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError('パスワードが正しくありません。');
      } else if (status === 429) {
        setError('試行回数が多すぎます。しばらくしてから再試行してください。');
      } else {
        setError('ログインに失敗しました。しばらくしてから再試行してください。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: COLORS.background,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          width: 360,
          bgcolor: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <LockIcon sx={{ fontSize: 32, color: COLORS.primary, mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: COLORS.textPrimary }}>
            Rusui Admin
          </Typography>
          <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
            管理者パスワードを入力してください
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          autoFocus
          required
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" fullWidth disabled={loading || !password}>
          {loading ? 'ログイン中...' : 'ログイン'}
        </Button>
      </Paper>
    </Box>
  );
}

export default LoginPage;
