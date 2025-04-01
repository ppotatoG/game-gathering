import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

import Auction from '../models/Auction';

console.log('✅ auctionRouter loaded');

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

export default router;
