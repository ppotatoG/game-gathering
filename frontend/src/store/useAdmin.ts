import { create } from 'zustand';

export const useAdminStore = create<AdminState>(set => ({
    isAdmin: false,
    auctionCode: '',
    auctionInfo: null,
    setAdmin: auction => set({ isAdmin: true, auctionCode: auction.code, auctionInfo: auction }),
    logoutAdmin: () => set({ isAdmin: false, auctionCode: '', auctionInfo: null })
}));
