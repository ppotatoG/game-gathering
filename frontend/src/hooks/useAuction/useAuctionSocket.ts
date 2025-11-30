import React, { useEffect } from 'react';

import socket from '@/lib/socket';

interface UseAuctionSocketProps {
    setTargetUser: (val: AuctionUserData | null) => void;
    setBids: (val: Bid[]) => void;
    setAuctionState: (val: AuctionState) => void;
    setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const useAuctionSocket = ({
    setTargetUser,
    setBids,
    setAuctionState,
    setChatMessages
}: UseAuctionSocketProps) => {
    useEffect(() => {
        socket.on('auction:show-user', (data: AuctionUserData) => {
            console.log(data);
            setTargetUser(data);
            setBids([]);
        });

        socket.on('auction:selected', (data: AuctionState) => {
            console.log(data);
            setAuctionState(data);
        });

        socket.on('auction:reset-complete', () => {
            console.log('[소켓] 경매 초기화 완료');
            setTargetUser(null);
            setBids([]);
            setAuctionState({
                currentTarget: null,
                captainBids: [],
                selectedUsers: [],
                round: 0,
                isFinished: false,
                isReady: false,
                isBidding: false,
                isPaused: false,
                captainPoints: {}
            });
        });

        socket.on('chatMessage', (data: ChatMessage) => {
            console.log('[소켓] 채팅 메시지 수신:', data);
            setChatMessages(prev => [...prev, data]);
        });

        socket.on('auction:ended', (data: { message: string; round: number }) => {
            console.log('[소켓] 경매 종료:', data);
            setTargetUser(null);
            setBids([]);
        });

        socket.on('auction:paused', (data: { message: string; round: number }) => {
            console.log('[소켓] 경매 일시정지:', data);
        });

        socket.on('auction:resumed', (data: { message: string; round: number }) => {
            console.log('[소켓] 경매 재개:', data);
        });

        return () => {
            socket.off('auction:show-user');
            socket.off('auction:selected');
            socket.off('auction:initialized');
            socket.off('chatMessage');
            socket.off('auction:ended');
            socket.off('auction:paused');
            socket.off('auction:resumed');
        };
    }, []);
};
