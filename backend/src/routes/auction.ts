console.log('✅ auctionRouter loaded');

import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

import Auction from '../models/Auction';
import AuctionUser from '../models/AuctionUser';

const router = Router();

type AuctionCreateRequest = {
    clubName: string;
    hostName: string;
    auctionTitle: string;
    memberCount: number;
    adminPassword: string;
};

type AuctionDocument = Document & {
    code: string;
    clubName: string;
    hostName: string;
    auctionTitle: string;
    memberCount: number;
    captainCount: number;
    adminPasswordHash: string;
    createdAt?: Date;
};

type AuctionCreateResponse = {
    success: boolean;
    data?: AuctionDocument;
    message?: string;
};

type AdminLoginRequest = {
    code: string;
    adminPassword: string;
};

type AdminLoginResponse = {
    success: boolean;
    data?: { code: string };
    message?: string;
};

type AuctionUserInput = {
    nickname: string;
    tag: string;
};

type BulkSaveRequest = {
    code: string;
    users: AuctionUserInput[];
};

type BulkSaveResponse = {
    success: boolean;
    message?: string;
};

type GetAuctionUsersResponse = {
    success: boolean;
    users?: AuctionUserInput[];
    message?: string;
};

router.post(
    '/create',
    async (
        req: Request<NonNullable<unknown>, AuctionCreateResponse, AuctionCreateRequest>,
        res: Response<AuctionCreateResponse>
    ) => {
        try {
            const { clubName, hostName, auctionTitle, memberCount, adminPassword } = req.body;

            if (!clubName || !hostName || !auctionTitle || !memberCount || !adminPassword) {
                res.status(400).json({ success: false, message: '필수 항목이 누락되었습니다.' });
                return;
            }

            if (memberCount % 5 !== 0) {
                res.status(400).json({
                    success: false,
                    message: '내전 인원은 5의 배수여야 합니다.',
                });
                return;
            }

            const code = nanoid(6).toUpperCase();
            const captainCount = memberCount / 5;
            const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

            const newAuction = await Auction.create({
                code,
                clubName,
                hostName,
                auctionTitle,
                memberCount,
                captainCount,
                adminPasswordHash,
            });

            res.status(200).json({
                success: true,
                data: newAuction,
            });
        } catch (error) {
            console.error('Auction Create Error:', error);
            res.status(500).json({
                success: false,
                message: '서버 오류입니다.',
            });
        }
    }
);

router.post(
    '/admin-login',
    async (
        req: Request<NonNullable<unknown>, AdminLoginResponse, AdminLoginRequest>,
        res: Response<AdminLoginResponse>
    ) => {
        const { code, adminPassword } = req.body;

        if (!code || !adminPassword) {
            res.status(400).json({ success: false, message: '정보가 부족합니다.' });
            return;
        }

        const auction = await Auction.findOne({ code });
        if (!auction) {
            res.status(404).json({ success: false, message: '경매를 찾을 수 없습니다.' });
            return;
        }

        const isMatch = await bcrypt.compare(adminPassword, auction.adminPasswordHash);
        if (!isMatch) {
            res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
            return;
        }

        res.status(200).json({ success: true, data: { code } });
    }
);

router.post(
    '/:code/users',
    async (
        req: Request<{ code: string }, BulkSaveResponse, { users: AuctionUserInput[] }>,
        res: Response<BulkSaveResponse>
    ) => {
        try {
            const { code } = req.params;
            const { users } = req.body;

            if (!code || !Array.isArray(users) || users.length === 0) {
                res.status(400).json({ success: false, message: '유효한 데이터가 없습니다.' });
                return;
            }

            await AuctionUser.findOneAndUpdate(
                { code },
                { users, createdAt: new Date() },
                { upsert: true, new: true }
            );

            res.status(200).json({ success: true });
        } catch (err) {
            console.error('[POST /api/auction/:code/users] 오류:', err);
            res.status(500).json({ success: false, message: '서버 오류입니다.' });
        }
    }
);

router.get(
    '/:code/users',
    async (
        req: Request<{ code: string }, GetAuctionUsersResponse>,
        res: Response<GetAuctionUsersResponse>
    ) => {
        try {
            const { code } = req.params;
            const auctionUsers = await AuctionUser.findOne({ code });

            if (!auctionUsers) {
                res.status(404).json({ success: false, message: '유저 정보가 없습니다.' });
                return;
            }

            res.status(200).json({ success: true, users: auctionUsers.users });
        } catch (err) {
            console.error('[GET /api/auction/:code/users] 오류:', err);
            res.status(500).json({ success: false, message: '서버 오류입니다.' });
        }
    }
);
export default router;
