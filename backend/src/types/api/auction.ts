import { Request, Response } from 'express';

import { AuctionDocument } from '@/types/model/auction';
import {
    AuctionUserInput,
    BulkSaveResponse,
    GetAuctionUsersResponse,
    AdminLoginResponse,
    BaseResponse,
} from '@/types/shared/auction';

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

export interface AuctionCreateResponse extends BaseResponse {
    data?: AuctionDocument;
}

export type AdminLoginReq = Request<unknown, AdminLoginResponse, AdminLoginRequest>;
export type AdminLoginRes = Response<AdminLoginResponse>;

export type AuctionCreateReq = Request<unknown, AuctionCreateResponse, AuctionCreateRequest>;
export type AuctionCreateRes = Response<AuctionCreateResponse>;

export type SaveAuctionUsersReq = Request<
    { code: string },
    BulkSaveResponse,
    { users: AuctionUserInput[] }
>;
export type SaveAuctionUsersRes = Response<BulkSaveResponse>;

export type GetAuctionUsersReq = Request<{ code: string }, GetAuctionUsersResponse>;
export type GetAuctionUsersRes = Response<GetAuctionUsersResponse>;

export type UpdateCaptainsReq = Request<{ code: string }, BaseResponse, { captains: string[] }>;
export type UpdateCaptainsRes = Response<BaseResponse>;

export type SyncRiotDataReq = Request<{ code: string }, BaseResponse>;
export type SyncRiotDataRes = Response<BaseResponse>;
