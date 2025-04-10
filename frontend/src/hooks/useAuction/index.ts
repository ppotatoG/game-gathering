import { useState } from 'react';

import { useAuctionActions } from './useAuctionActions';
import { useAuctionSocket } from './useAuctionSocket';
import { useAuctionState } from './useAuctionState';

export function useAuction() {
    const { shouldAskNickname, code, nickname, setNickname, joined, handleJoin } =
        useAuctionState();

    const [currentAuctionTarget, setTargetUser] = useState<AuctionUserData | null>(null);
    const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
    const [bids, setBids] = useState<Bid[]>([]);

    const { emitStart, emitBid, emitNextUser } = useAuctionActions({ code, nickname });

    useAuctionSocket({ setTargetUser, setBids, setAuctionState });

    return {
        shouldAskNickname,
        code,
        nickname,
        setNickname,
        joined,
        handleJoin,
        currentAuctionTarget,
        auctionState,
        bids,
        emitStart,
        emitBid,
        emitNextUser
    };
}
