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

        const availablePoint = state.captainPoints[nickname];
        if (selected.point > availablePoint) {
            socket.emit('error', `보유 포인트(${availablePoint})보다 높은 입찰은 불가능합니다.`);
            return;
        }

        state.captainPoints[nickname] -= selected.point;

        console.log(
            '[소켓] 낙찰 확정:',
            nickname,
            '→',
            auctionCode,
            `(남은 포인트: ${state.captainPoints[nickname]})`
        );

        io.to(auctionCode).emit('auction:finalized', {
            target: state.currentTarget,
            winner: selected,
            remainingPoint: state.captainPoints[nickname],
        });
    });
}
