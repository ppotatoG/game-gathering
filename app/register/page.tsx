"use client"

import { Button, TextField, Paper, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';

import { useUser } from '@/hooks/useUser';
import { useLoadingStore } from "@/store/loading"

export default function RegisterPage () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const { register } = useUser();
  const loadingCount = useLoadingStore((state) => state.loadingCount);

  const handleRegister = async () => {
    await register(email, password, nickname);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
      <Paper elevation={10} sx={{ padding: '30px', borderRadius: '20px' }}>
        <Box width="100%" maxWidth={400}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            회원가입
          </Typography>
          <TextField
            label="닉네임"
            fullWidth
            margin="normal"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <TextField
            label="이메일"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="비밀번호"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button variant="contained" fullWidth onClick={handleRegister} disabled={loadingCount > 0}>
            {loadingCount ? '가입 중...' : '회원가입'}
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
}
