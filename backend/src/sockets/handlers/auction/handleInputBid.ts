import { Server, Socket } from 'socket.io';

import { getAuctionState } from '@/utils/auctionStateRedis';

interface CaptainBid {
    nickname: string;
    point: number;
    teamId: string;
}

export default function handleInputBid(io: Server, socket: Socket) {
    socket.on(
        'auction:input',
        async ({ auctionCode, bid }: { auctionCode: string; bid: CaptainBid }) => {
            const state = await getAuctionState(auctionCode);

            if (!state) {
                socket.emit('error', '경매 상태가 초기화되지 않았습니다.');
                return;
            }

            if (!state.currentTarget) {
                socket.emit('error', '경매 타겟 유저가 없습니다.');
                return;
            }

            const existingIndex = state.captainBids.findIndex(b => b.nickname === bid.nickname);

            if (existingIndex !== -1) {
                state.captainBids[existingIndex] = bid;
            } else {
                state.captainBids.push(bid);
            }

            console.log('[소켓] 입찰 입력:', bid.nickname, bid.point, '→', auctionCode);

            io.to(auctionCode).emit('auction:selected', {
                captainBids: state.captainBids,
            });
        }
    );
}
