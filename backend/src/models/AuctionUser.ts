import mongoose, { Document, Schema } from 'mongoose';

export interface AuctionUserData {
    nickname: string;
    tag: string;
}

export interface AuctionUserDocument extends Document {
    code: string;
    users: AuctionUserData[];
    createdAt: Date;
    riotFetched: boolean;
    riotFetchedAt: Date | null;
}

const AuctionUserSchema = new Schema<AuctionUserDocument>(
    {
        code: { type: String, required: true, unique: true },
        users: [
            {
                nickname: { type: String, required: true },
                tag: { type: String, required: true },
            },
        ],
        createdAt: { type: Date, default: Date.now },
        riotFetched: { type: Boolean, default: false },
        riotFetchedAt: { type: Date, default: null },
    },
    {
        timestamps: false,
    }
);

export default mongoose.models.AuctionUser ||
    mongoose.model<AuctionUserDocument>('AuctionUser', AuctionUserSchema);
