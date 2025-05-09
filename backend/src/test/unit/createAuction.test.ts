import { createAuction } from '@/controllers/auctionController';
import Auction from '@/models/Auction';
import { AuctionCreateRequest, AuctionCreateReq, AuctionCreateRes } from '@/types/api/auction';

jest.mock('@/models/Auction');

const mockCreateData: AuctionCreateRequest = {
    clubName: '롤소모임',
    hostName: '최우제',
    auctionTitle: '2025 스프링 내전',
    memberCount: 10,
    adminPassword: '1234',
};

describe('createAuction', () => {
    const mockRequest = {
        body: mockCreateData,
    } as AuctionCreateReq;

    const mockResponse: AuctionCreateRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as AuctionCreateRes;

    it('should create an auction and return success', async () => {
        (Auction.create as jest.Mock).mockImplementation(async data => data);

        await createAuction(mockRequest, mockResponse);

        expect(Auction.create).toHaveBeenCalledWith(
            expect.objectContaining({
                clubName: '롤소모임',
                hostName: '최우제',
                auctionTitle: '2025 스프링 내전',
                memberCount: 10,
            })
        );

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                data: expect.objectContaining({
                    clubName: '롤소모임',
                }),
            })
        );
    });
});
