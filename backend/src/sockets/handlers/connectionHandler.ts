import { Server as Server } from 'socket.io';

import { nicknameMap } from '../stores/nicknameMap';

import AuctionUser, { AuctionUserDocument } from '@/models/AuctionUser';
import { AuctionSocket } from '@/types/socket';

export default function registerConnectionHandlers(io: Server, socket: AuctionSocket) {
    socket.on('auction:check-nickname', async ({ auctionCode, nickname }, callback) => {
        const lower = nickname.toLowerCase();
        const doc = (await AuctionUser.findOne({
            code: auctionCode,
        })) as AuctionUserDocument | null;

        const isCaptain =
            doc?.users.some(u => u.isCaptain && u.nickname.toLowerCase() === lower) ?? false;
        const isAlreadyJoined = nicknameMap.get(auctionCode)?.has(lower) ?? false;
        callback(isCaptain && !isAlreadyJoined);
    });

    socket.on('auction:join', async ({ auctionCode, nickname, isAdmin }) => {
        const lower = nickname?.toLowerCase?.();
        const doc = (await AuctionUser.findOne({
            code: auctionCode,
        })) as AuctionUserDocument | null;
        const currentSet = nicknameMap.get(auctionCode) || new Set();

        if (!doc) {
            socket.emit('join:denied', '경매 정보가 없습니다.');
            return;
        }

        if (isAdmin) {
            socket.join(auctionCode);
            socket.data.auctionCode = auctionCode;
            socket.data.nickname = 'admin';
            console.log(`✅ Admin joined (${auctionCode})`);
            return;
        }

        const allowedCaptains = doc.users.filter(u => u.isCaptain);
        if (!nickname || !allowedCaptains.some(u => u.nickname.toLowerCase() === lower)) {
            socket.emit('join:denied', '등록된 팀장이 아닙니다.');
            return;
        }

        if (currentSet.has(lower)) {
            socket.emit('join:denied', '이미 사용 중인 닉네임입니다.');
            return;
        }

        currentSet.add(lower);
        nicknameMap.set(auctionCode, currentSet);
        socket.join(auctionCode);
        socket.data.nickname = lower;
        socket.data.auctionCode = auctionCode;
        console.log(`✅ Captain joined: ${nickname} (${auctionCode})`);
    });

    socket.on('auction:leave', () => {
        const nickname = socket.data.nickname;
        const auctionCode = socket.data.auctionCode;
        if (!nickname || !auctionCode) return;

        const set = nicknameMap.get(auctionCode);
        set?.delete(nickname);
        if (set?.size === 0) nicknameMap.delete(auctionCode);

        socket.leave(auctionCode);
        console.log(`👋 User left: ${nickname} (${auctionCode})`);
    });

    socket.on('disconnect', () => {
        const nickname = socket.data.nickname;
        const auctionCode = socket.data.auctionCode;
        if (!nickname || !auctionCode) return;

        const set = nicknameMap.get(auctionCode);
        set?.delete(nickname);
        if (set?.size === 0) nicknameMap.delete(auctionCode);

        console.log(`❌ User disconnected: ${socket.id}, ${nickname} (${auctionCode})`);
    });
}
