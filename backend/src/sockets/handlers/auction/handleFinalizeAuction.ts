import { Server, Socket } from 'socket.io';

import { AuctionState } from '@/utils/AuctionState';

interface FinalizePayload {
    auctionCode: string;
    nickname: string;
}

export default function handleFinalizeAuction(io: Server, socket: Socket) {
    socket.on('auction:finalize', async ({ auctionCode, nickname }: FinalizePayload) => {
        const dao = new AuctionState(auctionCode);
        
        // 1. 필요한 상태 필드들을 DAO 메서드로 병렬 조회
        const [currentTarget, captainPoints, captainBids] = await Promise.all([
            dao.getCurrentTarget(),
            dao.getCaptainPoints(),
            dao.getCaptainBids(),
        ]);

        if (!currentTarget) {
            socket.emit('error', '경매 상태가 초기화되지 않았거나 타겟 유저가 없습니다.');
            return;
        }

        const selectedBid = captainBids.find(b => b.nickname === nickname);
        
        if (!selectedBid) {
            socket.emit('error', '해당 팀장의 입찰 정보가 없습니다.');
            return;
        }

        const availablePoint = captainPoints[nickname];
        
        if (selectedBid.point > availablePoint) {
            socket.emit('error', `보유 포인트(${availablePoint})보다 높은 입찰은 불가능합니다.`);
            return;
        }

        // 2. Redis에 포인트 감소 및 낙찰 정보 기록 (부분 업데이트)
        const remainingPoint = await dao.decrementCaptainPoint(nickname, selectedBid.point);
        
        // 3. 낙찰된 유저 정보를 selectedUsers 목록에 추가 (MongoDB 또는 Redis에 저장)
        await dao.addSelectedUser(currentTarget);

        // 4. 경매 상태 초기화 (currentTarget, captainBids 등)
        await dao.resetAuctionStatusForNextRound();

        console.log(
            '[소켓] 낙찰 확정:',
            nickname,
            '→',
            auctionCode,
            `(남은 포인트: ${remainingPoint})`
        );

        io.to(auctionCode).emit('auction:finalized', {
            target: currentTarget,
            winner: selectedBid,
            remainingPoint: remainingPoint,
        });
    });
}