import { Box, Typography, TextField, Button } from '@mui/material';

interface Props {
    nickname: string;
    setNickname: (val: string) => void;
    handleJoin: () => void;
}

export default function NicknameInput({ nickname, setNickname, handleJoin }: Props) {
    return (
        <Box p={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
                닉네임을 입력하고 입장하세요
            </Typography>
            <TextField
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter' && nickname.trim()) handleJoin();
                }}
                label="닉네임"
                size="small"
                sx={{ mt: 2, mb: 2, width: 300 }}
            />
            <br />
            <Button
                variant="contained"
                onClick={handleJoin}
                disabled={!nickname.trim()}
                sx={{ width: 300 }}
            >
                입장하기
            </Button>
        </Box>
    );
}
