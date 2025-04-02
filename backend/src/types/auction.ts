import { AuctionUserDocument } from '@/models/AuctionUser';
export interface AuctionCreateRequest {
    clubName: string;
    hostName: string;
    auctionTitle: string;
    memberCount: number;
    adminPassword: string;
}

export interface AuctionCreateResponse {
    success: boolean;
    data?: AuctionUserDocument;
    message?: string;
}

export interface AdminLoginRequest {
    code: string;
    adminPassword: string;
}

export interface AdminLoginResponse {
    success: boolean;
    data?: { code: string };
    message?: string;
}

export interface AuctionUserInput {
    nickname: string;
    tag: string;
}

export interface BulkSaveResponse {
    success: boolean;
    message?: string;
}

export interface GetAuctionUsersResponse {
    success: boolean;
    users?: AuctionUserInput[];
    message?: string;
    riotFetched?: boolean;
    riotFetchedAt?: Date | null;
}

export interface DefaultResponse {
    success: boolean;
    message?: string;
}
