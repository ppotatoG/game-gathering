import { Server, Socket } from 'socket.io';

import { auctionStateMap } from '../../stores/auctionStateMap';

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

        console.log(
            '[소켓] 경매 시작:',
            auctionCode,
            '-',
            state.currentTarget.nickname,
            state.currentTarget.tag
        );

        io.to(auctionCode).emit('auction:start-bid', {
            target: state.currentTarget,
            round: state.round,
        });
    });
}
