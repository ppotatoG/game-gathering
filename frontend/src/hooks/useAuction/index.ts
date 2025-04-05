import { useState } from 'react';

import { useAuctionActions } from './useAuctionActions';
import { useAuctionSocket } from './useAuctionSocket';
import { useAuctionState } from './useAuctionState';

export function useAuction() {
    const { shouldAskNickname, code, nickname, setNickname, joined, handleJoin } =
        useAuctionState();

    const [targetUser, setTargetUser] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [bids, setBids] = useState<any[]>([]);

    const { emitStart, emitBid } = useAuctionActions({ code, nickname });

    useAuctionSocket({ setTargetUser, setBids, setSelectedUser });

    return {
        shouldAskNickname,
        code,
        nickname,
        setNickname,
        joined,
        handleJoin,
        targetUser,
        selectedUser,
        bids,
        emitStart,
        emitBid
    };
}
