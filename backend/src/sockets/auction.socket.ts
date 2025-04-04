import { Server, Socket } from 'socket.io';

import { handleAuctionStart, handleAuctionInput } from '@/controllers/auctionController';

export default function auctionSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log(`🔌 User connected: ${socket.id}`);

        socket.on('chatMessage', data => {
            io.emit('chatMessage', data);
        });

        socket.on('auction:start', data => handleAuctionStart(io, socket, data));
        socket.on('auction:input', data => handleAuctionInput(io, socket, data));

        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });
}
