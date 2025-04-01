import { create } from 'zustand';

export const useAdminStore = create<AdminState>(set => ({
    isAdmin: false,
    auctionCode: '',
    setAdmin: code => set({ isAdmin: true, auctionCode: code }),
    logoutAdmin: () => set({ isAdmin: false, auctionCode: '' })
}));
