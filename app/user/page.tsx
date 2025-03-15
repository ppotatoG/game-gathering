"use client"
import { Container, Typography, List, ListItem } from "@mui/material"
import {useState, useEffect} from "react";

import {useUser} from "@/hooks/useUser";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { fetchUsers } = useUser();

  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  return (
    <Container sx={{ marginTop: 8 }}>
      <Typography variant="h5" gutterBottom>
        소모임 유저 목록
      </Typography>
      <List>
        {users.map((user, index) => (
          <ListItem key={index}>
            {user.name}
          </ListItem>
        ))}
      </List>
    </Container>
  )
}
