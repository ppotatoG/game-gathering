export interface AuctionCreateRequest {
    clubName: string;
    hostName: string;
    auctionTitle: string;
    memberCount: number;
    adminPassword: string;
}

export interface AdminLoginRequest {
    code: string;
    adminPassword: string;
}

export interface AuctionUserInput {
    nickname: string;
    tag: string;
    weight: number;
}

export interface BaseResponse {
    success: boolean;
    message?: string;
}

export interface GetAuctionUsersResponse extends BaseResponse {
    users?: AuctionUserInput[];
    riotFetched?: boolean;
    riotFetchedAt?: Date | null;
}

export interface BulkSaveResponse extends BaseResponse {}

export interface AdminLoginResponse extends BaseResponse {
    data?: { code: string };
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

export interface AuctionStartPayload {
    auctionId: string;
    round: number;
    targetUser: string;
}

export interface AuctionInputPayload {
    auctionId: string;
    bid: AuctionBid;
}
