import { Server, Socket } from 'socket.io';

import { getAuctionState, setAuctionState } from '@/utils/auctionStateRedis';
import { clearAuctionTimer } from '@/utils/auctionTimer';

interface EndAuctionPayload {
    auctionCode: string;
}

export default function handleEndAuction(io: Server, socket: Socket) {
    socket.on('auction:end', async ({ auctionCode }: EndAuctionPayload) => {
        const state = await getAuctionState(auctionCode);

        if (!state) {
            socket.emit('error', '경매 상태가 초기화되지 않았습니다.');
            return;
        }

        if (state.isFinished) {
            socket.emit('error', '이미 종료된 경매입니다.');
            return;
        }

        // 경매가 시작되지 않았거나 진행 중이 아닌 경우 종료 불가
        if (!state.isReady && !state.isBidding && !state.isPaused && state.round === 0) {
            socket.emit('error', '경매가 시작되지 않아 종료할 수 없습니다.');
            return;
        }

        // 타이머 정리
        if (state.timerId) {
            clearAuctionTimer(state);
        }

        // 경매 종료 상태로 변경
        await setAuctionState(auctionCode, {
            ...state,
            isFinished: true,
            isBidding: false,
            isPaused: false,
            timerId: undefined,
            endAt: undefined,
        });

        console.log('[소켓] 경매 종료:', auctionCode);

        io.to(auctionCode).emit('auction:ended', {
            message: '경매가 종료되었습니다.',
            round: state.round,
        });
    });
}
