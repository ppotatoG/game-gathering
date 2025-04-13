import { Server, Socket } from 'socket.io';

import { auctionStateMap, CaptainPoints } from '../../stores/auctionStateMap';

import AuctionUser, { AuctionUserDocument } from '@/models/AuctionUser';

const DEFAULT_CAPTAIN_POINTS = 1000;

export default function handleInitAuction(io: Server, socket: Socket) {
    socket.on('auction:init', async ({ auctionCode }) => {
        if (!auctionCode) {
            socket.emit('error', 'auctionCode가 필요합니다.');
            return;
        }

        const doc = (await AuctionUser.findOne({
            code: auctionCode,
        })) as AuctionUserDocument | null;
        if (!doc) {
            socket.emit('error', '경매 정보를 찾을 수 없습니다.');
            return;
        }

        const captainPoints: CaptainPoints = {};
        doc.users.forEach(u => {
            if (u.isCaptain) {
                captainPoints[u.nickname] = DEFAULT_CAPTAIN_POINTS;
            }
        });

        auctionStateMap.set(auctionCode, {
            currentTarget: null,
            captainBids: [],
            selectedUsers: [],
            round: 0,
            isFinished: false,
            captainPoints,
        });

        console.log('[소켓] 경매 상태 초기화 완료:', auctionCode);
        socket.emit('auction:initialized');
    });
}
