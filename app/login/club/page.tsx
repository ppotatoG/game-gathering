"use client"
import { TextField, Button, Container, Typography } from "@mui/material"
import { useState } from "react"

import { useLoginClub } from "@/hooks/club"

export default function LoginPage() {
  const [ownerId, setOwnerId] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useLoginClub()
  const handleSubmit = async () => {
    await login(ownerId, password);
  }

  return (
    <Container maxWidth="xs" sx={{ marginTop: 8 }}>
      <Typography variant="h5" gutterBottom>
        로그인
      </Typography>
      <TextField
        label="ownerId"
        fullWidth
        margin="normal"
        value={ownerId}
        onChange={e => setOwnerId(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Button variant="contained" fullWidth onClick={handleSubmit}>
        로그인
      </Button>
    </Container>
  )
}
