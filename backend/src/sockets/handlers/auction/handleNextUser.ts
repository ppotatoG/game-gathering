import { Server, Socket } from 'socket.io';

import AuctionUser from '@/models/AuctionUser';
import { getAuctionState, setAuctionState } from '@/utils/auctionStateRedis';
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

            const state = await getAuctionState(auctionCode);
            if (!state) {
                socket.emit('error', '경매 상태가 초기화되지 않았습니다.');
                return;
            }

            if (state.isFinished) {
                socket.emit('error', '경매가 종료되었습니다.');
                return;
            }

            if (state.isPaused) {
                socket.emit('error', '일시정지된 경매입니다. 먼저 경매를 재개해주세요.');
                return;
            }

            if (state.isBidding) {
                socket.emit(
                    'error',
                    '경매가 진행 중입니다. 현재 경매를 완료한 후 다음 유저를 선택할 수 있습니다.'
                );
                return;
            }

            const remaining = getRemainingUsers(doc.users, state.selectedUsers);
            console.log('[BACK] 남은 유저 수:', remaining.length);

            if (remaining.length === 0) {
                console.log('[BACK] 모든 유저 경매 완료 ✅');
                await setAuctionState(auctionCode, {
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

            await setAuctionState(auctionCode, updatedState);

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

            const emitPayload = {
                nickname,
                tag,
                riotFetched,
                riotFetchedAt,
                mainRole,
                subRole,
                mostChampion,
                isCaptain,
                round: updatedState.round,
            };

            io.to(auctionCode).emit('auction:show-user', emitPayload);
        } catch (err) {
            console.error('[소켓] auction:next-user 처리 중 에러 발생:', err);
            socket.emit('error', '서버 오류 발생');
        }
    });
}
