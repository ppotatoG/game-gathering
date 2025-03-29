import mongoose, { Schema, Document } from 'mongoose';

export interface AuctionDocument extends Document {
    code: string;
    clubName: string;
    hostName: string;
    auctionTitle: string;
    memberCount: number;
    captainCount: number;
    createdAt: Date;
}

const AuctionSchema: Schema = new Schema( {
    code: { type: String, required: true, unique: true },
    clubName: { type: String, required: true },
    hostName: { type: String, required: true },
    auctionTitle: { type: String, required: true },
    memberCount: { type: Number, required: true },
    captainCount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
} );

export default mongoose.model<AuctionDocument>( 'Auction', AuctionSchema );
