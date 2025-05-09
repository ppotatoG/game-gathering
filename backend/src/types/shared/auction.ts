export interface BaseResponse {
    success: boolean;
    message?: string;
}

export interface AuctionUserInput {
    nickname: string;
    tag: string;
    weight: number;
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

export interface AuctionStartPayload {
    auctionId: string;
    round: number;
    targetUser: string;
}

export interface AuctionInputPayload {
    auctionId: string;
    bid: {
        user: string;
        point: number;
        teamId: string;
    };
}
