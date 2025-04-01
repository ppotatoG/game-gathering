interface AuctionCreateRequest {
    clubName: string;
    hostName: string;
    auctionTitle: string;
    memberCount: number;
    adminPassword: string;
}

interface Auction {
    code: string;
    clubName: string;
    hostName: string;
    auctionTitle: string;
    memberCount: number;
    captainCount: number;
    createdAt?: string;
}

interface AuctionCreateResponse {
    success: boolean;
    data?: Auction;
    message?: string;
}

interface AuctionUserInput {
    nickname: string;
    tag: string;
}

interface AuctionUser extends AuctionUserInput {
    code: string;
    createdAt: string;
    currentTier?: string;
    highestTier?: string;
    mainRole?: string;
    riotFetched: boolean;
    riotFetchedAt?: string;
}
