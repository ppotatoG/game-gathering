export interface AuctionDocument {
    code: string;
    clubName: string;
    hostName: string;
    auctionTitle: string;
    memberCount: number;
    captainCount: number;
    createdAt: Date;
    adminPasswordHash: string;
}

export interface AuctionUserData {
    nickname: string;
    tag: string;
    weight: number;
    riotFetched: boolean;
    riotFetchedAt: Date | null;
    mainRole?: string | null;
    subRole?: string | null;
    mostChampion?: string | null;
    isCaptain?: boolean;
}

export interface AuctionUserDocument {
    code: string;
    users: AuctionUserData[];
    createdAt: Date;
    riotFetched: boolean;
    riotFetchedAt: Date | null;
}

export interface AuctionBid {
    user: string;
    point: number;
    teamId: string;
}

export interface AuctionLog {
    auctionId: string;
    round: number;
    targetUser: string;
    selectedBy: string;
    bid: AuctionBid[];
    status: 'pending' | 'confirmed';
    createdAt: Date;
    updatedAt: Date;
}
