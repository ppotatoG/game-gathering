import { Button, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';

interface Props {
    emitInit: () => void;
    emitNextUser: () => void;
    currentAuctionTarget: AuctionUserData | null;
}

export default function AdminControls({ emitInit, emitNextUser, currentAuctionTarget }: Props) {
    return (
        <Grid2 container spacing={2} padding={2} alignItems="center">
            <Button onClick={emitInit} sx={{ mt: 2 }}>
                초기화
            </Button>
            <Button variant="outlined" onClick={emitNextUser} sx={{ mt: 2 }}>
                경매 대상 유저 선택 (테스트)
            </Button>
            <Typography variant="h6" gutterBottom sx={{ ml: 2 }}>
                경매 대상: {currentAuctionTarget?.nickname || '아직 선택되지 않았습니다.'}
            </Typography>
        </Grid2>
    );
}
