import { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';

import AuctionLogModel from '@/models/AuctionLog';
import { AuctionBid } from '@/types/model/auction';
import { AuctionStartPayload, AuctionInputPayload } from '@/types/shared/auction';

const currentBids = new Map<string, AuctionBid[]>();
const endTimers = new Map<string, NodeJS.Timeout>();

export const handleAuctionStart = (io: Server, socket: Socket, data: AuctionStartPayload) => {
    const { auctionId, round, targetUser } = data;
    startAuction(io, { auctionId, round, targetUser });
};

export const handleAuctionInput = (io: Server, socket: Socket, data: AuctionInputPayload) => {
    const { auctionId, bid } = data;
    const list = currentBids.get(auctionId) || [];
    list.push(bid);
    currentBids.set(auctionId, list);

    const timer = endTimers.get(auctionId);
    if (timer) {
        clearInterval(timer);
        startAuction(io, { auctionId, round: 0, targetUser: '' });
    }
};

const startAuction = (io: Server, { auctionId, round, targetUser }: AuctionStartPayload) => {
    io.emit('auction:show-user', { auctionId, round, targetUser });
    currentBids.set(auctionId, []);

    const endTime = Date.now() + 10000;

    const interval = setInterval(() => {
        const now = Date.now();
        if (now >= endTime) {
            clearInterval(interval);
            endTimers.delete(auctionId);

            const bids = currentBids.get(auctionId) || [];
            const maxBid = bids.sort((a, b) => b.point - a.point)[0];
            currentBids.delete(auctionId);

            const auctionLog = new AuctionLogModel({
                auctionId,
                round,
                targetUser,
                selectedBy: maxBid?.teamId || null,
                bid: bids,
                status: 'pending',
            });

            auctionLog.save();
            io.emit('auction:selected', auctionLog);
        }
    }, 200);

    endTimers.set(auctionId, interval);
};

export const createAuctionStartHandler = (io: Server) => {
    return async (req: Request, res: Response) => {
        const { auctionId, round, targetUser } = req.body;
        startAuction(io, { auctionId, round, targetUser });
        res.status(200).json({ success: true });
    };
};
