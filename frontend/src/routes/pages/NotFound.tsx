import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate()

    const goHome = () => {
        navigate( '/' );
    };

    return (
        <Box
            minHeight="80vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
        >
            <Typography variant="h4">404 - 페이지를 찾을 수 없습니다.</Typography>
            <Button variant="contained" onClick={goHome}>
                홈으로 돌아가기
            </Button>
        </Box>
    );
}
