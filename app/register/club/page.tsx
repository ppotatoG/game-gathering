'use client'
import { FormControl, InputLabel, Input, Button } from '@mui/material';
import { useState, FormEvent } from 'react';

import { useCreateClub } from "@/hooks/club";

export default function ClubRegisterPage() {
  const [clubName, setClubName] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [password, setPassword] = useState('');

  const { create } = useCreateClub();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await create({clubName, ownerId, password});
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <InputLabel>클럽 이름</InputLabel>
        <Input value={clubName} onChange={(e) => setClubName(e.target.value)} />
      </FormControl>
      <FormControl>
        <InputLabel>소유자 아이디</InputLabel>
        <Input value={ownerId} onChange={(e) => setOwnerId(e.target.value)} />
      </FormControl>
      <FormControl>
        <InputLabel>비밀번호</InputLabel>
        <Input value={password} onChange={(e) => setPassword(e.target.value)} />
      </FormControl>
      <Button type="submit">클럽 생성</Button>
    </form>
  )
}
