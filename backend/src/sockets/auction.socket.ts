import { Server } from 'socket.io';

import registerAuctionHandlers from './handlers/auction';
import registerChatHandler from './handlers/chatHandler';
import registerConnectionHandlers from './handlers/connectionHandler';

import { AuctionSocket } from '@/types/socket';

export default function auctionSocket(io: Server) {
    io.on('connection', socket => {
        console.log(`🔌 User connected: ${socket.id}`);

        const typedSocket = socket as unknown as AuctionSocket;

        registerChatHandler(io, typedSocket);
        registerAuctionHandlers(io, typedSocket);
        registerConnectionHandlers(io, typedSocket);
    });
}
