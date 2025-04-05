import { Server, Socket } from 'socket.io';

import { handleAuctionStart, handleAuctionInput } from '@/controllers/auctionController';
import AuctionUser from '@/models/AuctionUser';

const nicknameMap = new Map<string, Set<string>>();

export default function auctionSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log(`🔌 User connected: ${socket.id}`);

        socket.on('chatMessage', data => {
            io.emit('chatMessage', data);
        });

        socket.on('auction:start', data => handleAuctionStart(io, socket, data));
        socket.on('auction:input', data => handleAuctionInput(io, socket, data));

        socket.on('auction:check-nickname', async ({ auctionCode, nickname }, callback) => {
            const lower = nickname.toLowerCase();
            const doc = await AuctionUser.findOne({ code: auctionCode });

            const isCaptain = doc?.users.some(
                u => u.isCaptain && u.nickname.toLowerCase() === lower
            );

            const isAlreadyJoined = nicknameMap.get(auctionCode)?.has(lower) ?? false;

            const isValid = isCaptain && !isAlreadyJoined;

            callback(isValid);
        });

        socket.on('auction:join', async ({ auctionCode, nickname, isAdmin }) => {
            const lower = nickname?.toLowerCase?.();
            const doc = await AuctionUser.findOne({ code: auctionCode });

            if (!doc) {
                socket.emit('join:denied', '경매 정보가 없습니다.');
                return;
            }

            const allowedCaptains = doc.users.filter(u => u.isCaptain);
            const currentSet = nicknameMap.get(auctionCode) || new Set();

            if (isAdmin) {
                socket.join(auctionCode);
                (socket as any).auctionCode = auctionCode;
                (socket as any).nickname = 'admin';
                console.log(`✅ Admin joined (${auctionCode})`);
                return;
            }

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
            (socket as any).nickname = lower;
            (socket as any).auctionCode = auctionCode;

            console.log(`✅ Captain joined: ${nickname} (${auctionCode})`);
        });

        // ✅ 명시적인 퇴장 처리
        socket.on('auction:leave', () => {
            const nickname = (socket as any).nickname;
            const auctionCode = (socket as any).auctionCode;

            if (!nickname || !auctionCode) return;

            const set = nicknameMap.get(auctionCode);
            if (set) {
                set.delete(nickname);
                if (set.size === 0) {
                    nicknameMap.delete(auctionCode);
                }
            }

            socket.leave(auctionCode);
            console.log(`👋 User left: ${nickname} (${auctionCode})`);
        });

        // ✅ 예외용 disconnect
        socket.on('disconnect', () => {
            const nickname = (socket as any).nickname;
            const auctionCode = (socket as any).auctionCode;

            if (!nickname || !auctionCode) return;

            const set = nicknameMap.get(auctionCode);
            if (set) {
                set.delete(nickname);
                if (set.size === 0) {
                    nicknameMap.delete(auctionCode);
                }
            }

            console.log(`❌ User disconnected: ${socket.id}, ${nickname} (${auctionCode})`);
        });
    });
}
