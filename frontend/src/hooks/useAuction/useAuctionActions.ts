import socket from '@/lib/socket';

export const useAuctionActions = ({ code, nickname }: { code: string; nickname: string }) => {
    const emitStart = (round: number, targetUser: string) => {
        socket.emit('auction:start', {
            auctionId: code,
            round,
            targetUser
        });
    };

    const emitBid = (point: number, teamId: string) => {
        socket.emit('auction:input', {
            auctionId: code,
            bid: { user: nickname, point, teamId }
        });
    };

    const emitNextUser = () => {
        socket.emit('auction:next-user', { auctionCode: code });
    };

    return { emitStart, emitBid, emitNextUser };
};
