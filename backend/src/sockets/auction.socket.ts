import { Server, Socket } from 'socket.io';

import registerAuctionHandlers from './handlers/auction';
import registerChatHandler from './handlers/chatHandler';
import registerConnectionHandlers from './handlers/connectionHandler';

export default function auctionSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log(`🔌 User connected: ${socket.id}`);

        registerChatHandler(io, socket);
        registerAuctionHandlers(io, socket);
        registerConnectionHandlers(io, socket);
    });
}
