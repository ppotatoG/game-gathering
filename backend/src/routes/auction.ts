console.log('✅ auctionRouter loaded');

import { Router } from 'express';
import { Server } from 'socket.io';

import {
    createAuction,
    adminLogin,
    saveAuctionUsers,
    getAuctionUsers,
    syncRiotData,
    updateCaptains,
    createAuctionStartHandler,
} from '@/controllers/auctionController';

export default function auctionRouter(io: Server) {
    const router = Router();

    router.post('/create', createAuction);
    router.post('/admin-login', adminLogin);

    router.post('/:code/users', saveAuctionUsers);
    router.get('/:code/users', getAuctionUsers);
    router.patch('/:code/users/riot', syncRiotData);
    router.patch('/:code/users/captains', updateCaptains);

    router.post('/start', createAuctionStartHandler(io));

    return router;
}
