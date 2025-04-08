import { Server, Socket } from 'socket.io';

import { handleAuctionStart, handleAuctionInput } from '@/controllers/auctionController';

export default function registerAuctionHandlers(io: Server, socket: Socket) {
    socket.on('auction:start', data => handleAuctionStart(io, socket, data));
    socket.on('auction:input', data => handleAuctionInput(io, socket, data));
}
