import { Request, Response } from 'express';

import {
    AuctionCreateRequest,
    AuctionUserInput,
    BulkSaveResponse,
    GetAuctionUsersResponse,
    AdminLoginRequest,
    AdminLoginResponse,
    BaseResponse,
} from './auction';

import { AuctionUserDocument } from '@/models/AuctionUser';

export interface AuctionCreateResponse extends BaseResponse {
    data?: AuctionUserDocument;
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
