import { Request, Response, Router } from 'express';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

import Auction from '../models/Auction';

const router = Router();

type AuctionCreateRequest = {
    clubName: string;
    hostName: string;
    auctionTitle: string;
    memberCount: number;
};

type AuctionDocument = Document & {
    code: string;
    clubName: string;
    hostName: string;
    auctionTitle: string;
    memberCount: number;
    captainCount: number;
    createdAt?: Date;
};

type AuctionCreateResponse = {
    success: boolean;
    data?: AuctionDocument;
    message?: string;
};

router.post(
    '/create',
    async (
        req: Request<{}, AuctionCreateResponse, AuctionCreateRequest>,
        res: Response<AuctionCreateResponse>
    ) => {
        try {
            const { clubName, hostName, auctionTitle, memberCount } = req.body;

            if (!clubName || !hostName || !auctionTitle || !memberCount) {
                res.status(400).json({
                    success: false,
                    message: '필수 항목이 누락되었습니다.',
                });
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

            const newAuction = await Auction.create({
                code,
                clubName,
                hostName,
                auctionTitle,
                memberCount,
                captainCount,
            });

            res.status(200).json({
                success: true,
                data: newAuction,
            });
            return;
        } catch (error) {
            console.error('Auction Create Error:', error);
            res.status(500).json({
                success: false,
                message: '서버 오류입니다.',
            });
            return;
        }
    }
);

export default router;
