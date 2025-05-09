import { dummyUsers } from '@/constants/test/dummyUsers';
import { saveAuctionUsers } from '@/controllers/auctionController';
import AuctionUser from '@/models/AuctionUser';
import { SaveAuctionUsersReq, SaveAuctionUsersRes } from '@/types/api/auction';

jest.mock('@/models/AuctionUser');

describe('saveAuctionUsers', () => {
    const mockRequest = {
        params: { code: 'abc123' },
        body: {
            users: dummyUsers,
        },
    } as unknown as SaveAuctionUsersReq;

    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as SaveAuctionUsersRes;

    it('should save users and return success', async () => {
        (AuctionUser.findOneAndUpdate as jest.Mock).mockResolvedValue({});

        await saveAuctionUsers(mockRequest, mockResponse);

        expect(AuctionUser.findOneAndUpdate).toHaveBeenCalledWith(
            { code: 'abc123' },
            expect.objectContaining({
                users: expect.any(Array),
                createdAt: expect.any(Date),
            }),
            { upsert: true, new: true, overwrite: true }
        );

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
    });
});
