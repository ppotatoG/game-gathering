console.log('✅ auctionRouter loaded');

import { Router } from 'express';

import {
    createAuction,
    adminLogin,
    saveAuctionUsers,
    getAuctionUsers,
} from '@/controllers/auctionController';

const router = Router();

router.post('/create', createAuction);
router.post('/admin-login', adminLogin);
router.post('/:code/users', saveAuctionUsers);
router.get('/:code/users', getAuctionUsers);

export default router;
