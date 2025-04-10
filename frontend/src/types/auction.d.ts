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
    riotFetched: boolean;
    riotFetchedAt: Date | null;
    mainRole?: string | null;
    subRole?: string | null;
    mostChampion?: string | null;
    isCaptain?: boolean;
}

interface GetAuctionUsersResponse {
    success: boolean;
    code: string;
    users: AuctionUserData[];
    createdAt: Date;
    riotFetched: boolean;
    riotFetchedAt: Date | null;
}

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
