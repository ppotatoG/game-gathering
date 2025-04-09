import { AuctionUserData } from '@/models/AuctionUser';

interface Bid {
    nickname: string;
    point: number;
    teamId: string;
}

interface AuctionState {
    currentTarget: AuctionUserData | null;
    captainBids: Bid[];
    selectedUsers: AuctionUserData[];
    round: number;
    isFinished: boolean;
}

export const auctionStateMap = new Map<string, AuctionState>();
