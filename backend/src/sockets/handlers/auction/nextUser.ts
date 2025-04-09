import { Server, Socket } from 'socket.io';

import { auctionStateMap } from '../../stores/auctionStateMap';

import AuctionUser, { AuctionUserDocument } from '@/models/AuctionUser';

export default function handleNextUser(io: Server, socket: Socket) {
    socket.on('auction:next-user', async ({ auctionCode }) => {
        console.log('[소켓] 경매 다음 유저 요청:', auctionCode);

        const doc = (await AuctionUser.findOne({
            code: auctionCode,
        })) as AuctionUserDocument | null;

        if (!doc) {
            socket.emit('error', '경매 정보를 찾을 수 없습니다.');
            return;
        }

        const allUsers = doc.users;
        const currentState = auctionStateMap.get(auctionCode) || {
            captainBids: [],
            selectedUsers: [],
            round: 0,
            isFinished: false,
        };

        if (currentState.isFinished) {
            console.log('[BACK] 이미 종료된 경매입니다. 요청 무시.');
            return;
        }

        const selectedIds = currentState.selectedUsers.map(u => `${u.nickname}#${u.tag}`);
        const remaining = allUsers.filter(
            u =>
                !u.isCaptain &&
                !(u as any).is_admin &&
                !selectedIds.includes(`${u.nickname}#${u.tag}`)
        );

        console.log(`[BACK] ROUND ${currentState.round + 1}`);
        console.log(`[BACK] 남은 유저 수: ${remaining.length}`);
        if (remaining.length) {
            console.log(`[BACK] 첫 번째 남은 유저: ${remaining[0].nickname}#${remaining[0].tag}`);
        }

        if (remaining.length === 0) {
            console.log('[BACK] 모든 유저 경매 완료 ✅');
            auctionStateMap.set(auctionCode, {
                ...currentState,
                isFinished: true,
                currentTarget: null,
            });
            io.to(auctionCode).emit('auction:finished');
            return;
        }

        const randomIndex = Math.floor(Math.random() * remaining.length);
        const selectedUser = remaining[randomIndex];

        auctionStateMap.set(auctionCode, {
            ...currentState,
            currentTarget: selectedUser,
            captainBids: [],
            round: currentState.round + 1,
        });

        console.log('[BACK] 유저 선택:', selectedUser);
        io.to(auctionCode).emit('auction:show-user', selectedUser);
    });
}
