import { Server, Socket } from 'socket.io';

import AuctionUser from '@/models/AuctionUser';
import { getAuctionState, setAuctionState } from '@/utils/auctionStateRedis';
import { resetTimer, clearAuctionTimer } from '@/utils/auctionTimer';
import { getRandomUser } from '@/utils/getRandomUser';
import { getRemainingUsers } from '@/utils/getRemainingUsers';

export default function handleStartBid(io: Server, socket: Socket) {
    socket.on('auction:start-bid', async ({ auctionCode }) => {
        const state = await getAuctionState(auctionCode);

        if (!state) {
            socket.emit('error', '경매 상태가 초기화되지 않았습니다.');
            return;
        }

        if (state.isFinished) {
            socket.emit('error', '이미 종료된 경매입니다.');
            return;
        }

        if (state.isPaused) {
            socket.emit('error', '일시정지된 경매입니다. 먼저 경매를 재개해주세요.');
            return;
        }

        if (state.isBidding) {
            socket.emit('error', '이미 진행 중인 경매입니다.');
            return;
        }

        // 경매 대상이 없으면 자동으로 선택
        if (!state.currentTarget) {
            const doc = await AuctionUser.findOne({ code: auctionCode });
            if (!doc) {
                socket.emit('error', '경매 정보를 찾을 수 없습니다.');
                return;
            }

            const remaining = getRemainingUsers(doc.users, state.selectedUsers);
            if (remaining.length === 0) {
                await setAuctionState(auctionCode, {
                    ...state,
                    isFinished: true,
                    currentTarget: null,
                });
                io.to(auctionCode).emit('auction:finished');
                socket.emit('error', '모든 유저의 경매가 완료되었습니다.');
                return;
            }

            const selectedUser = getRandomUser(remaining);
            const updatedState = {
                ...state,
                currentTarget: selectedUser,
                captainBids: [],
                round: state.round + 1,
                selectedUsers: [...state.selectedUsers, selectedUser],
            };

            await setAuctionState(auctionCode, updatedState);

            // 프론트엔드에 경매 대상 알림
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
                round: updatedState.round,
            });

            // 상태 업데이트
            state.currentTarget = selectedUser;
            state.round = updatedState.round;
            state.selectedUsers = updatedState.selectedUsers;
        }

        console.log('🧪 currentTarget', state.currentTarget);
        console.log('🧪 isBidding', state.isBidding);

        const onTimeout = () => {
            state.isBidding = false;
            clearAuctionTimer(state);
            const highest = [...state.captainBids].sort((a, b) => b.point - a.point)[0] ?? null;
            io.to(auctionCode).emit('auction:timeout', {
                winner: highest,
                target: state.currentTarget,
                round: state.round,
            });
        };

        state.isBidding = true;
        state.isPaused = false;

        resetTimer(state, io, auctionCode, onTimeout);

        // Redis에 상태 저장
        await setAuctionState(auctionCode, {
            ...state,
            isBidding: true,
            isPaused: false,
        });

        io.to(auctionCode).emit('auction:start-bid', {
            target: state.currentTarget,
            round: state.round,
            endAt: state.endAt,
        });
    });
}
