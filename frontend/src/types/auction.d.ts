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

interface AuctionUserData {
    nickname: string;
    tag: string;
}

interface GetAuctionUsersResponse {
    success: boolean;
    users: AuctionUserData[];
    riotFetched: boolean;
    riotFetchedAt: string | null;
}
