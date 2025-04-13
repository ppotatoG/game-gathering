import { Server, Socket } from 'socket.io';

import { auctionStateMap } from '../../stores/auctionStateMap';

interface FinalizePayload {
    auctionCode: string;
    nickname: string;
}

export default function handleFinalizeAuction(io: Server, socket: Socket) {
    socket.on('auction:finalize', ({ auctionCode, nickname }: FinalizePayload) => {
        const state = auctionStateMap.get(auctionCode);

        if (!state) {
            socket.emit('error', '경매 상태가 초기화되지 않았습니다.');
            return;
        }

        if (!state.currentTarget) {
            socket.emit('error', '현재 경매 타겟이 없습니다.');
            return;
        }

        const selected = state.captainBids.find(b => b.nickname === nickname);
        if (!selected) {
            socket.emit('error', '해당 팀장의 입찰 정보가 없습니다.');
            return;
        }

        console.log('[소켓] 낙찰 확정:', nickname, '→', auctionCode);

        // 낙찰 정보는 broadcast
        io.to(auctionCode).emit('auction:finalized', {
            target: state.currentTarget,
            winner: selected,
        });

        // 이후에 DB 저장은 따로 추가
    });
}
