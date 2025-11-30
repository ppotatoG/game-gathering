import socket from '@/lib/socket';

export const useAuctionActions = ({ code, nickname }: { code: string; nickname: string }) => {
    const emitInit = () => {
        console.log('[소켓] 경매 초기화');
        socket.emit('auction:reset', { auctionCode: code });
    };

    const emitStart = (round: number, targetUser: string) => {
        socket.emit('auction:start', {
            auctionId: code,
            round,
            targetUser
        });
    };

    const emitBid = (bid: Omit<Bid, 'nickname'>) => {
        socket.emit('auction:input', {
            auctionCode: code,
            bid: {
                nickname,
                ...bid
            }
        });

        socket.emit('chatMessage', {
            user: nickname,
            message: String(bid.point)
        });
    };

    const emitNextUser = () => {
        console.log('[소켓] 다음 유저');
        socket.emit('auction:next-user', { auctionCode: code });
    };

    const emitStartBid = () => {
        console.log('[소켓] 경매 시작');
        socket.emit('auction:start-bid', { auctionCode: code });
    };

    const emitEnd = () => {
        console.log('[소켓] 경매 종료');
        socket.emit('auction:end', { auctionCode: code });
    };

    const emitPause = (paused: boolean) => {
        console.log('[소켓] 경매 일시정지/재개', paused);
        socket.emit('auction:pause', { auctionCode: code, paused });
    };

    return { emitInit, emitStart, emitBid, emitNextUser, emitStartBid, emitEnd, emitPause };
};
