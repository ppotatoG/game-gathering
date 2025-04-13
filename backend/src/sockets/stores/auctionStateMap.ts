import { AuctionUserData } from '@/models/AuctionUser';

interface Bid {
    nickname: string;
    point: number;
    teamId: string;
}

export interface CaptainPoints {
    [nickname: string]: number;
}

export interface AuctionState {
    currentTarget: AuctionUserData | null;
    captainBids: Bid[];
    selectedUsers: AuctionUserData[];
    round: number;
    isFinished: boolean;
    captainPoints: CaptainPoints;
}

export const auctionStateMap = new Map<string, AuctionState>();
