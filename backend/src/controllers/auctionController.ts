import axios from 'axios';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

import Auction from '@/models/Auction';
import AuctionUser from '@/models/AuctionUser';
import {
    AuctionCreateRequest,
    AuctionCreateResponse,
    AdminLoginRequest,
    AdminLoginResponse,
    AuctionUserInput,
    BulkSaveResponse,
    GetAuctionUsersResponse,
    DefaultResponse,
} from '@/types/auction';
import { sleep } from '@/utils/sleep';

export const createAuction = async (
    req: Request<AuctionCreateRequest>,
    res: Response<AuctionCreateResponse>
) => {
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

export const adminLogin = async (
    req: Request<{}, AdminLoginResponse, AdminLoginRequest>,
    res: Response<AdminLoginResponse>
) => {
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

        res.status(200).json({ success: true, data: { code } });
        return;
    } catch (err) {
        console.error('Admin Login Error:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
        return;
    }
};

export const saveAuctionUsers = async (
    req: Request<{ code: string }, BulkSaveResponse, { users: AuctionUserInput[] }>,
    res: Response<BulkSaveResponse>
) => {
    try {
        const { code } = req.params;
        const { users } = req.body;

        if (!code || !Array.isArray(users)) {
            res.status(400).json({ success: false, message: '유효하지 않은 유저 데이터' });
            return;
        }

        const withFlags = users.map(user => ({
            ...user,
            riotFetched: false,
            riotFetchedAt: null,
        }));

        await AuctionUser.findOneAndUpdate(
            { code },
            { users: withFlags, createdAt: new Date() },
            { upsert: true, new: true, overwrite: true }
        );

        res.status(200).json({ success: true });
        return;
    } catch (err) {
        console.error('Save Users Error:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
        return;
    }
};

export const getAuctionUsers = async (
    req: Request<{ code: string }, GetAuctionUsersResponse>,
    res: Response<GetAuctionUsersResponse>
) => {
    try {
        const { code } = req.params;
        const doc = await AuctionUser.findOne({ code });

        if (!doc) {
            res.status(404).json({ success: false, message: '유저 없음' });
            return;
        }

        res.status(200).json({
            success: true,
            users: doc.users,
            riotFetched: doc.riotFetched,
            riotFetchedAt: doc.riotFetchedAt,
        });
        return;
    } catch (err) {
        console.error('Get Users Error:', err);
        res.status(500).json({ success: false, message: '서버 오류' });
        return;
    }
};
