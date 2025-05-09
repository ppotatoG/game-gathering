import { dummyCaptains } from '@/constants/dummyCaptains';
import { dummyUsers } from '@/constants/dummyUsers';
import { updateCaptains } from '@/controllers/auctionController';
import Auction from '@/models/Auction';
import AuctionUser from '@/models/AuctionUser';
import { UpdateCaptainsReq, UpdateCaptainsRes } from '@/types/api/auction';

jest.mock('@/models/Auction');
jest.mock('@/models/AuctionUser');

describe('updateCaptains', () => {
    const mockRequest = {
        params: { code: 'abc123' },
        body: { captains: dummyCaptains },
    } as unknown as UpdateCaptainsReq;

    const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as unknown as UpdateCaptainsRes;

    it('should update captains and return success', async () => {
        (Auction.findOne as jest.Mock).mockResolvedValue({ captainCount: 4 });

        const dummyDoc = {
            users: dummyUsers.map(u => ({
                ...u,
                isCaptain: dummyCaptains.includes(u.nickname),
            })),
            save: jest.fn(),
        };

        (AuctionUser.findOne as jest.Mock).mockResolvedValue(dummyDoc);

        await updateCaptains(mockRequest, mockResponse);

        const findUser = (nickname: string) => {
            const found = dummyDoc.users.find(u => u.nickname === nickname);
            if (!found) throw new Error(`유저 ${nickname} 못 찾음`);
            return found;
        };

        expect(findUser('폭풍의주인공').isCaptain).toBe(true);
        expect(findUser('베인장인').isCaptain).toBe(true);
        expect(findUser('달려라달려').isCaptain).toBe(false);
        expect(findUser('블루도둑').isCaptain).toBe(false);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
    });
});
