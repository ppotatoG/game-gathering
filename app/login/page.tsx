"use client"
import { TextField, Button, Container, Typography } from "@mui/material"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = () => {
    // 로그인 로직 (Firebase Auth 등)
  }

  return (
    <Container maxWidth="xs" sx={{ marginTop: 8 }}>
      <Typography variant="h5" gutterBottom>
        로그인
      </Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={e => setEmail(e.target.value)}
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
