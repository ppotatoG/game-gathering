import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { io, Socket } from 'socket.io-client';

// Socket 서버 주소 (개발용)
const socket: Socket = io('http://localhost:8080');

interface ChatMessage {
    user: string;
    message: string;
}

const ChatRoom: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [nickname, setNickname] = useState('User');
    const [inputMessage, setInputMessage] = useState('');

    // 서버에서 메시지 받으면 messages 배열에 추가
    useEffect(() => {
        socket.on('chatMessage', (data: ChatMessage) => {
            setMessages(prev => [...prev, data]);
        });

        return () => {
            socket.off('chatMessage');
        };
    }, []);

    // 메시지 전송
    const sendMessage = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            if (!inputMessage.trim()) return;

            const newMsg: ChatMessage = {
                user: nickname,
                message: inputMessage
            };

            // 자신 포함 전체 클라이언트에 메시지 브로드캐스트
            socket.emit('chatMessage', newMsg);
            setInputMessage('');
        },
        [inputMessage, nickname]
    );

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 2 }}>
                <Typography variant="h5" gutterBottom>
                    소켓 채팅 예시
                </Typography>
                {/* 닉네임 */}
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="닉네임"
                        value={nickname}
                        onChange={e => setNickname(e.target.value)}
                        fullWidth
                    />
                </Box>

                {/* 메시지 목록 */}
                <List
                    sx={{ border: '1px solid #ccc', borderRadius: 1, minHeight: 300, mb: 2, p: 0 }}
                >
                    {messages.map((msg, idx) => (
                        <ListItem key={idx}>
                            <ListItemText primary={`${msg.user}: ${msg.message}`} />
                        </ListItem>
                    ))}
                </List>

                {/* 메시지 전송 */}
                <form onSubmit={sendMessage}>
                    <Box display="flex" gap={1}>
                        <TextField
                            label="메시지를 입력하세요"
                            variant="outlined"
                            fullWidth
                            value={inputMessage}
                            onChange={e => setInputMessage(e.target.value)}
                        />
                        <Button type="submit" variant="contained">
                            전송
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default ChatRoom;
