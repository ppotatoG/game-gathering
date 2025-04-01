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

export const saveAuctionUsers = async (
    code: string,
    users: AuctionUserInput[]
): Promise<{ success: boolean }> => {
    const res = await $axios.post(`/api/auction/${code}/users`, { users });
    return res.data;
};

export const getAuctionUsers = async (code: string): Promise<AuctionUser[]> => {
    const res = await $axios.get(`/api/auction/${code}/users`);
    return res.data.users;
};

export const fetchRiotDataForUsers = async (code: string): Promise<void> => {
    await $axios.patch(`/api/auction/${code}/users/riot`);
};
