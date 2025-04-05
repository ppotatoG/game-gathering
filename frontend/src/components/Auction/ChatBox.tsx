import { Box, TextField, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';

import socket from '@/lib/socket';

const ChatBox = ({ nickname }: { nickname: string }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ user: string; message: string }[]>([]);
    const [isComposing, setIsComposing] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;
        socket.emit('chatMessage', { user: nickname, message: input });
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isComposing) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        socket.on('chatMessage', data => {
            setMessages(prev => [...prev, data]);
        });

        return () => {
            socket.off('chatMessage');
        };
    }, []);

    return (
        <Box>
            <Box
                sx={{
                    height: 300,
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    p: 1,
                    mb: 1
                }}
            >
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        <strong>{msg.user}</strong>: {msg.message}
                    </div>
                ))}
            </Box>
            <TextField
                fullWidth
                size="small"
                placeholder="메시지를 입력하세요"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                sx={{ mb: 1 }}
            />
            <Button variant="contained" fullWidth onClick={handleSend}>
                보내기
            </Button>
        </Box>
    );
};

export default ChatBox;
