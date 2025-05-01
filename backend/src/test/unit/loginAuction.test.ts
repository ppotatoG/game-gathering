import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { adminLogin } from '@/controllers/auctionController';
import Auction from '@/models/Auction';
import { AdminLoginRequest, AdminLoginResponse } from '@/types/auction';

jest.mock('@/models/Auction');
jest.mock('bcrypt');

const mockLoginData: AdminLoginRequest = {
    code: 'TEST123',
    adminPassword: '1234',
};

describe('adminLogin', () => {
    const mockRequest = {
        body: mockLoginData,
    } as Request<any, AdminLoginResponse, AdminLoginRequest>;

    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as Response;

    it('should return token if credentials match', async () => {
        (Auction.findOne as jest.Mock).mockResolvedValueOnce({
            adminPasswordHash: 'hashed_pw',
            code: 'TEST123',
            generateToken: () => 'faketoken',
            toObject: () => ({ code: 'TEST123' }),
        });

        (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

        await adminLogin(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: true,
            data: { code: 'TEST123' },
        });
    });
});
