import { Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { useParams } from 'react-router-dom';

import AdminControls from '@/components/Auction/AdminControls';
import AuctionUserTable from '@/components/Auction/AuctionUserTable';
import ChatBox from '@/components/Auction/ChatBox';
import NicknameInput from '@/components/Auction/NicknameInput';
import { useAuction } from '@/hooks/useAuction';
import { useAuctionUsers } from '@/hooks/useAuctionUsers';

export default function Auction() {
    const { code } = useParams<{ code: string }>();
    const { users } = useAuctionUsers(code || '');

    const {
        isAdmin,
        shouldAskNickname,
        nickname,
        setNickname,
        handleJoin,
        bids,
        emitStartBid,
        currentAuctionTarget,
        emitInit,
        emitBid,
        emitEnd,
        emitPause,
        auctionState,
        chatMessages
    } = useAuction();

    if (shouldAskNickname) {
        return (
            <NicknameInput nickname={nickname} setNickname={setNickname} handleJoin={handleJoin} />
        );
    }

    return (
        <>
            {isAdmin && (
                <AdminControls
                    emitInit={emitInit}
                    emitStartBid={emitStartBid}
                    emitEnd={emitEnd}
                    emitPause={emitPause}
                    currentAuctionTarget={currentAuctionTarget}
                    auctionState={auctionState}
                />
            )}
            <Grid2 container spacing={2} padding={2}>
                <AuctionUserTable users={users} currentTarget={currentAuctionTarget} />

                <Grid2 size="grow">
                    <Typography variant="h6" gutterBottom sx={{ ml: 2 }}>
                        경매 대상: {currentAuctionTarget?.nickname || '아직 선택되지 않았습니다.'}
                    </Typography>
                    <ChatBox nickname={nickname} emitBid={emitBid} messages={chatMessages} />
                </Grid2>

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
