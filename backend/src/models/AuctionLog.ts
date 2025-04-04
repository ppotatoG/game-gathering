import { Schema, model } from 'mongoose';

import { AuctionLog } from '@/types/auction';

const AuctionLogSchema = new Schema<AuctionLog>({
    auctionId: { type: String, required: true },
    round: Number,
    targetUser: String,
    selectedBy: String,
    bid: [{ user: String, point: Number, teamId: String }],
    status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default model<AuctionLog>('AuctionLog', AuctionLogSchema);
