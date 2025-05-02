import { Server, Socket } from 'socket.io';

import { auctionStateMap } from '../../stores/auctionStateMap';

import AuctionUser from '@/models/AuctionUser';
import { getRandomUser } from '@/utils/getRandomUser';
import { getRemainingUsers } from '@/utils/getRemainingUsers';

export default function handleNextUser(io: Server, socket: Socket) {
    socket.on('auction:next-user', async ({ auctionCode }) => {
        try {
            console.log('[소켓] 경매 다음 유저 요청:', auctionCode);

            const doc = await AuctionUser.findOne({ code: auctionCode });
            if (!doc) {
                socket.emit('error', '경매 정보를 찾을 수 없습니다.');
                return;
            }

            const state = auctionStateMap.get(auctionCode);
            if (!state) {
                socket.emit('error', '경매 상태가 초기화되지 않았습니다.');
                return;
            }

            if (state.isFinished) {
                socket.emit('error', '경매가 종료되었습니다.');
                return;
            }

            const remaining = getRemainingUsers(doc.users, state.selectedUsers);
            console.log('[BACK] 남은 유저 수:', remaining.length);

            if (remaining.length === 0) {
                console.log('[BACK] 모든 유저 경매 완료 ✅');
                auctionStateMap.set(auctionCode, {
                    ...state,
                    isFinished: true,
                    currentTarget: null,
                });
                io.to(auctionCode).emit('auction:finished');
                return;
            }

            const selectedUser = getRandomUser(remaining);
            console.log('[BACK] 선택된 유저:', selectedUser.nickname, selectedUser.tag);

            const updatedState = {
                ...state,
                currentTarget: selectedUser,
                captainBids: [],
                round: state.round + 1,
                selectedUsers: [...state.selectedUsers, selectedUser],
            };

            auctionStateMap.set(auctionCode, updatedState);

            const {
                nickname,
                tag,
                riotFetched,
                riotFetchedAt,
                mainRole,
                subRole,
                mostChampion,
                isCaptain,
            } = selectedUser;

            io.to(auctionCode).emit('auction:show-user', {
                nickname,
                tag,
                riotFetched,
                riotFetchedAt,
                mainRole,
                subRole,
                mostChampion,
                isCaptain,
                round: state.round,
            });
        } catch (err) {
            console.error('[소켓] auction:next-user 처리 중 에러 발생:', err);
            socket.emit('error', '서버 오류 발생');
        }
    });
}
