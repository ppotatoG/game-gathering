import { Server, Socket } from 'socket.io';

import { auctionStateMap } from '../../stores/auctionStateMap';

export default function handleInitAuction(io: Server, socket: Socket) {
    socket.on('auction:init', ({ auctionCode }) => {
        if (!auctionCode) {
            socket.emit('error', 'auctionCode가 필요합니다.');
            return;
        }

        auctionStateMap.set(auctionCode, {
            currentTarget: null,
            captainBids: [],
            selectedUsers: [],
            round: 0,
            isFinished: false,
        });

        console.log('[소켓] 경매 상태 초기화:', auctionCode);
        socket.emit('auction:initialized');
    });
}
