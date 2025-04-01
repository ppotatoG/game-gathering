import $axios from '@/lib/axios';

export const createAuction = async (
    payload: AuctionCreateRequest
): Promise<AuctionCreateResponse> => {
    const response = await $axios.post<AuctionCreateResponse>('/api/auction/create', payload);
    return response.data;
};

export const adminLogin = async (code: string, adminPassword: string) => {
    const response = await $axios.post('/api/auction/admin-login', { code, adminPassword });
    return response.data;
};
