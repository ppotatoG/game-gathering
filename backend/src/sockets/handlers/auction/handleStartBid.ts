import { Server, Socket } from 'socket.io';

import { auctionStateMap } from '../../stores/auctionStateMap';

import { resetTimer, clearAuctionTimer } from '@/utils/auctionTimer';

export default function handleStartBid(io: Server, socket: Socket) {
    socket.on('auction:start-bid', ({ auctionCode }) => {
        const state = auctionStateMap.get(auctionCode);

        if (!state) {
            socket.emit('error', '경매 상태가 초기화되지 않았습니다.');
            return;
        }
        if (!state.currentTarget) {
            socket.emit('error', '경매 타겟 유저가 없습니다.');
            return;
        }

        console.log('🧪 currentTarget', state.currentTarget);
        console.log('🧪 isBidding', state.isBidding);

        const onTimeout = () => {
            state.isBidding = false;
            clearAuctionTimer(state);
            const highest = [...state.captainBids].sort((a, b) => b.point - a.point)[0] ?? null;
            io.to(auctionCode).emit('auction:timeout', {
                winner: highest,
                target: state.currentTarget,
                round: state.round,
            });
        };

        state.isBidding = true;

        resetTimer(state, io, auctionCode, onTimeout);

        io.to(auctionCode).emit('auction:start-bid', {
            target: state.currentTarget,
            round: state.round,
            endAt: state.endAt,
        });
    });
}
