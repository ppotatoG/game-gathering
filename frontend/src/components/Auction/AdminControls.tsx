import { Button, Typography, Box } from '@mui/material';
import Grid2 from '@mui/material/Grid2';

interface Props {
    emitInit: () => void;
    emitStartBid: () => void;
    emitEnd: () => void;
    emitPause: (paused: boolean) => void;
    currentAuctionTarget: AuctionUserData | null;
    auctionState: AuctionState | null;
}

export default function AdminControls({
    emitInit,
    emitStartBid,
    emitEnd,
    emitPause,
    currentAuctionTarget,
    auctionState
}: Props) {
    const isPaused = auctionState?.isPaused ?? false;
    const isFinished = auctionState?.isFinished ?? false;
    const isBidding = auctionState?.isBidding ?? false;
    const round = auctionState?.round ?? 0;
    const isInitialized = auctionState !== null; // 초기화가 되어있는지 확인

    // 경매 시작 버튼: 초기화되어 있고, 종료되지 않았고, 진행 중이 아니고, 일시정지되지 않았으면 활성화
    const canStartBid = isInitialized && !isBidding && !isPaused && !isFinished;

    // 일시정지/종료 버튼: 경매가 시작된 후 (round > 0 또는 isBidding)에만 활성화
    const canEndOrPause = (round > 0 || isBidding || isPaused) && !isFinished;

    return (
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mb: 2 }}>
            <Grid2 container spacing={2} alignItems="center">
                <Grid2>
                    <Button variant="outlined" color="inherit" onClick={emitInit} size="small">
                        초기화
                    </Button>
                </Grid2>
                <Grid2>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={emitStartBid}
                        size="large"
                        disabled={!canStartBid}
                        sx={{ minWidth: 120, fontWeight: 'bold' }}
                    >
                        경매 시작
                    </Button>
                </Grid2>
                <Grid2>
                    <Button
                        variant="contained"
                        color={isPaused ? 'success' : 'warning'}
                        onClick={() => emitPause(!isPaused)}
                        size="small"
                        disabled={!canEndOrPause}
                    >
                        {isPaused ? '재개' : '일시정지'}
                    </Button>
                </Grid2>
                <Grid2>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={emitEnd}
                        size="small"
                        disabled={!canEndOrPause}
                    >
                        종료
                    </Button>
                </Grid2>
                <Grid2 size="grow">
                    <Typography variant="h6" sx={{ ml: 2, color: 'text.primary' }}>
                        경매 대상: {currentAuctionTarget?.nickname || '선택되지 않음'}
                    </Typography>
                </Grid2>
            </Grid2>
        </Box>
    );
}
