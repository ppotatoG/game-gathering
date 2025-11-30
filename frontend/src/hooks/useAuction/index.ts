import { useState } from 'react';

import { useAuctionActions } from './useAuctionActions';
import { useAuctionSocket } from './useAuctionSocket';
import { useAuctionState } from './useAuctionState';

export function useAuction() {
    const { isAdmin, shouldAskNickname, code, nickname, setNickname, joined, handleJoin } =
        useAuctionState();

    const [currentAuctionTarget, setTargetUser] = useState<AuctionUserData | null>(null);
    const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
    const [bids, setBids] = useState<Bid[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    const { emitStart, emitBid, emitNextUser, emitInit, emitStartBid, emitEnd, emitPause } =
        useAuctionActions({
            code,
            nickname
        });

    useAuctionSocket({ setTargetUser, setBids, setAuctionState, setChatMessages });

    return {
        isAdmin,
        shouldAskNickname,
        code,
        nickname,
        setNickname,
        joined,
        handleJoin,
        currentAuctionTarget,
        auctionState,
        bids,
        chatMessages,
        emitStart,
        emitBid,
        emitNextUser,
        emitInit,
        emitStartBid,
        emitEnd,
        emitPause
    };
}
