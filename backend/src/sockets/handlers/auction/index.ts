import { Server, Socket } from 'socket.io';

import handleEndAuction from './handleEndAuction';
import handleFinalizeAuction from './handleFinalizeAuction';
import handleInitAuction from './handleInitAuction';
import handleInputBid from './handleInputBid';
import handleNextUser from './handleNextUser';
import handlePauseAuction from './handlePauseAuction';
import handleStartBid from './handleStartBid';

export default function registerAuctionHandlers(io: Server, socket: Socket) {
    handleInitAuction(io, socket);
    handleNextUser(io, socket);
    handleStartBid(io, socket);
    handleInputBid(io, socket);
    handleFinalizeAuction(io, socket);
    handleEndAuction(io, socket);
    handlePauseAuction(io, socket);
}
