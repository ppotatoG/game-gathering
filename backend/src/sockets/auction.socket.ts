import { Server, Socket } from 'socket.io';

import { handleAuctionInput, handleAuctionStart } from '@/controllers/auctionController';

export default function auctionSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        socket.on('auction:start', data => handleAuctionStart(io, socket, data));
        socket.on('auction:input', data => handleAuctionInput(io, socket, data));
    });
}
