import { Request, Response } from 'express';

import AuctionUser from '@/models/AuctionUser';
import {
    AuctionUserInput,
    BulkSaveResponse,
    DefaultResponse,
    GetAuctionUsersResponse,
} from '@/types/auction';
import { fetchUserRiotData } from '@/utils/riot/syncRiotUser';
import { sleep } from '@/utils/sleep';

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

export const syncRiotData = async (
    req: Request<{ code: string }, DefaultResponse>,
    res: Response<DefaultResponse>
) => {
    try {
        const { code } = req.params;
        const RIOT_API_KEY = process.env.RIOT_API_KEY;
        const matchRegion = 'asia';

        if (!RIOT_API_KEY) {
            res.status(500).json({ success: false, message: 'API 키 없음' });
            return;
        }

        const doc = await AuctionUser.findOne({ code });
        if (!doc) {
            res.status(404).json({ success: false, message: '유저 없음' });
            return;
        }

        // if (doc.riotFetched) {
        //     console.warn(`[⚠️ 연동 차단됨] 이미 연동됨: ${code}`);
        //     res.status(400).json({ success: false, message: '이미 라이엇 데이터 연동됨' });
        //     return;
        // }

        console.log(`[🟢 연동 시작] code: ${code}, 유저 수: ${doc.users.length}`);

        const enrichedUsers = [];
        const targetUsers = doc.users.slice(0, 2);

        for (const [i, user] of targetUsers.entries()) {
            console.log(`\n[🔍 ${i + 1}/${targetUsers.length}] 유저: ${user.nickname}`);

            try {
                const data = await fetchUserRiotData(user.nickname, user.tag, RIOT_API_KEY);

                if (data) {
                    enrichedUsers.push({ ...user, ...data });
                } else {
                    enrichedUsers.push(user);
                }

                await sleep(1200);
            } catch (e: any) {
                console.error(`[❌ Riot 연동 실패: ${user.nickname}]`, e.message);
                if (e.response) {
                    console.error('[📛 응답 코드]', e.response.status);
                    console.error('[📛 응답 바디]', e.response.data);
                }
                enrichedUsers.push(user);
                await sleep(1200);
            }
        }

        doc.users = enrichedUsers;
        doc.riotFetched = true;
        doc.riotFetchedAt = new Date();
        await doc.save();

        console.log(`\n[✅ 연동 완료] 유저 수: ${enrichedUsers.length}, code: ${code}`);

        res.status(200).json({ success: true });
    } catch (err: any) {
        console.error('Riot Sync Error:', err);
        if (err.response) {
            console.error('[📛 응답 코드]', err.response.status);
            console.error('[📛 응답 바디]', err.response.data);
        }
        res.status(500).json({ success: false, message: '서버 오류' });
    }
};
