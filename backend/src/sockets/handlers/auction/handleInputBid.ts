import { Server, Socket } from 'socket.io';

import { auctionStateMap } from '../../stores/auctionStateMap';

interface CaptainBid {
    nickname: string;
    point: number;
    teamId: string;
}

export default function handleInputBid(io: Server, socket: Socket) {
    socket.on('auction:input', ({ auctionCode, bid }: { auctionCode: string; bid: CaptainBid }) => {
        const state = auctionStateMap.get(auctionCode);

        if (!state) {
            socket.emit('error', '경매 상태가 초기화되지 않았습니다.');
            return;
        }

        if (!state.currentTarget) {
            socket.emit('error', '경매 타겟 유저가 없습니다.');
            return;
        }

        // 기존에 동일한 nickname 있으면 갱신, 없으면 추가
        const existingIndex = state.captainBids.findIndex(b => b.nickname === bid.nickname);

        if (existingIndex !== -1) {
            state.captainBids[existingIndex] = bid;
        } else {
            state.captainBids.push(bid);
        }

        console.log('[소켓] 입찰 입력:', bid.nickname, bid.point, '→', auctionCode);

        io.to(auctionCode).emit('auction:selected', {
            captainBids: state.captainBids,
        });
    });
}
