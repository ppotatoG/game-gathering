import mongoose, { Document, Schema } from 'mongoose';

export interface AuctionUserData {
    nickname: string;
    tag: string;
}

export interface AuctionUserDocument extends Document {
    code: string;
    users: AuctionUserData[];
    createdAt: Date;
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
    },
    {
        timestamps: false,
    }
);

export default mongoose.models.AuctionUser ||
    mongoose.model<AuctionUserDocument>('AuctionUser', AuctionUserSchema);
