import { Box, TextField, Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

interface Props {
    nickname: string;
    emitBid: (bid: { point: number; teamId: string }) => void;
    messages: ChatMessage[];
}

const ChatBox = ({ emitBid, messages }: Props) => {
    const [input, setInput] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (!input.trim()) return;

        const point = parseInt(input.trim(), 10);
        if (!isNaN(point)) {
            emitBid({ point, teamId: 'A' });
        }

        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isComposing) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <Box>
            <Box
                ref={scrollRef}
                sx={{
                    height: 300,
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    p: 1,
                    mb: 1,
                    backgroundColor: '#fafafa'
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
                placeholder="숫자만 입력하세요 (입찰)"
                value={input}
                onChange={e => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) setInput(val); // 숫자만 허용
                }}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                sx={{ mb: 1 }}
            />
            <Button variant="contained" fullWidth onClick={handleSend} disabled={!input.trim()}>
                입찰 보내기
            </Button>
        </Box>
    );
};

export default ChatBox;
