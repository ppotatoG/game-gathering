import { Box, Typography, Divider, TextField, Button } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { useParams } from 'react-router-dom';

import ChatBox from '@/components/Auction/ChatBox';
import { useAuction } from '@/hooks/useAuction';
import { useAuctionUsers } from '@/hooks/useAuctionUsers';

export default function Auction() {
    const { code } = useParams<{ code: string }>();
    const { users } = useAuctionUsers(code || '');

    const {
        shouldAskNickname,
        nickname,
        setNickname,
        handleJoin,
        bids,
        emitNextUser,
        currentAuctionTarget
    } = useAuction();

    if (shouldAskNickname) {
        return (
            <Box p={4} textAlign="center">
                <Typography variant="h6" gutterBottom>
                    닉네임을 입력하고 입장하세요
                </Typography>
                <TextField
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && nickname.trim()) {
                            handleJoin();
                        }
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

    return (
        <>
            <Grid2 container spacing={2} padding={2}>
                <Button variant="outlined" onClick={emitNextUser} sx={{ mt: 2 }}>
                    경매 대상 유저 선택 (테스트)
                </Button>
                <Typography variant="h6" gutterBottom>
                    경매 대상: {currentAuctionTarget?.nickname || '아직 선택되지 않았습니다.'}
                </Typography>
            </Grid2>
            <Grid2 container spacing={2} padding={2}>
                {/* 왼쪽: 유저 리스트 */}
                <Grid2 size="grow">
                    <Typography variant="h6" gutterBottom>
                        내전 코드: {code}
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    {users.map((user, idx) => (
                        <Box key={`${user.nickname}-${idx}`} sx={{ mb: 0.5 }}>
                            • {user.nickname}#{user.tag}
                        </Box>
                    ))}
                </Grid2>

                {/* 중앙: 채팅 */}
                <Grid2 size="grow">
                    <Typography variant="h6" gutterBottom>
                        채팅
                    </Typography>
                    <ChatBox nickname={nickname} />
                </Grid2>

                {/* 오른쪽: 낙찰 정보 */}
                <Grid2 size="grow">
                    <Typography variant="h6" gutterBottom>
                        팀 정보
                    </Typography>
                    {bids.length ? (
                        bids.map((bid, idx) => (
                            <Typography key={idx}>🏷️ 대상자: {bid.nickname}</Typography>
                        ))
                    ) : (
                        <Typography variant="body2">아직 낙찰된 팀원이 없습니다.</Typography>
                    )}
                </Grid2>
            </Grid2>
        </>
    );
}
