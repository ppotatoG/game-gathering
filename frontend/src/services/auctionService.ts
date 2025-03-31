import $axios from '@/lib/axios';

export const createAuction = async (
    payload: AuctionCreateRequest
): Promise<AuctionCreateResponse> => {
    const response = await $axios.post<AuctionCreateResponse>('/api/auction/create', payload);
    return response.data;
};
