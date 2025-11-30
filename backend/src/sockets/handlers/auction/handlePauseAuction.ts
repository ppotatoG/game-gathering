import { Server, Socket } from 'socket.io';

import { getAuctionState, setAuctionState } from '@/utils/auctionStateRedis';
import { clearAuctionTimer } from '@/utils/auctionTimer';

interface PauseAuctionPayload {
    auctionCode: string;
    paused: boolean; // true: 일시정지, false: 재개
}

export default function handlePauseAuction(io: Server, socket: Socket) {
    socket.on('auction:pause', async ({ auctionCode, paused }: PauseAuctionPayload) => {
        const state = await getAuctionState(auctionCode);

        if (!state) {
            socket.emit('error', '경매 상태가 초기화되지 않았습니다.');
            return;
        }

        if (state.isFinished) {
            socket.emit('error', '종료된 경매는 일시정지할 수 없습니다.');
            return;
        }

        if (paused) {
            // 일시정지
            if (state.isPaused) {
                socket.emit('error', '이미 일시정지된 경매입니다.');
                return;
            }

            // 경매가 시작되지 않았거나 진행 중이 아닌 경우 일시정지 불가
            if (!state.isBidding && !state.isReady && state.round === 0) {
                socket.emit('error', '경매가 시작되지 않아 일시정지할 수 없습니다.');
                return;
            }

            // 타이머가 실행 중이면 정리
            if (state.timerId) {
                clearAuctionTimer(state);
            }

            await setAuctionState(auctionCode, {
                ...state,
                isPaused: true,
                isBidding: false,
                timerId: undefined,
                endAt: undefined,
            });

            console.log('[소켓] 경매 일시정지:', auctionCode);

            io.to(auctionCode).emit('auction:paused', {
                message: '경매가 일시정지되었습니다.',
                round: state.round,
            });
        } else {
            // 재개
            if (!state.isPaused) {
                socket.emit('error', '일시정지되지 않은 경매입니다.');
                return;
            }

            await setAuctionState(auctionCode, {
                ...state,
                isPaused: false,
            });

            console.log('[소켓] 경매 재개:', auctionCode);

            io.to(auctionCode).emit('auction:resumed', {
                message: '경매가 재개되었습니다.',
                round: state.round,
            });
        }
    });
}
