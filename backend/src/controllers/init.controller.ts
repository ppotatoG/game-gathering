import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

import Auction from '@/models/Auction';
import {
    AuctionCreateReq,
    AuctionCreateRes,
    AdminLoginReq,
    AdminLoginRes,
} from '@/types/api/auction';

export const createAuction = async (req: AuctionCreateReq, res: AuctionCreateRes) => {
    try {
        const { clubName, hostName, auctionTitle, memberCount, adminPassword } = req.body;

        if (!clubName || !hostName || !auctionTitle || !memberCount || !adminPassword) {
            res.status(400).json({ success: false, message: '필수 항목 누락' });
            return;
        }

        if (memberCount % 5 !== 0) {
            res.status(400).json({ success: false, message: '5의 배수만 허용' });
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

        res.status(200).json({ success: true, data: newAuction });
        return;
    } catch (err) {
        console.error('Create Auction Error:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
        return;
    }
};

export const adminLogin = async (req: AdminLoginReq, res: AdminLoginRes) => {
    try {
        const { code, adminPassword } = req.body;

        if (!code || !adminPassword) {
            res.status(400).json({ success: false, message: '정보 부족' });
            return;
        }

        const auction = await Auction.findOne({ code });
        if (!auction) {
            res.status(404).json({ success: false, message: '경매 없음' });
            return;
        }

        const isMatch = await bcrypt.compare(adminPassword, auction.adminPasswordHash);
        if (!isMatch) {
            res.status(401).json({ success: false, message: '비밀번호 불일치' });
            return;
        }

        const safeAuction = auction.toObject();
        delete safeAuction.adminPasswordHash;

        res.status(200).json({ success: true, data: safeAuction });
        return;
    } catch (err) {
        console.error('Admin Login Error:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
        return;
    }
};
