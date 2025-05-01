import { Server } from 'socket.io';

import { AuctionState } from '@/sockets/stores/auctionStateMap';

export const resetTimer = (
    state: AuctionState,
    io: Server,
    room: string,
    onTimeout: () => void
) => {
    clearTimeout(state.timerId);
    state.endAt = Date.now() + 10_000;
    state.timerId = setTimeout(onTimeout, 10_000);
    io.to(room).emit('auction:tick', { endAt: state.endAt });
};

export const clearAuctionTimer = (state: AuctionState) => {
    clearTimeout(state.timerId);
    state.timerId = undefined;
    state.endAt = undefined;
    state.isBidding = false;
};
