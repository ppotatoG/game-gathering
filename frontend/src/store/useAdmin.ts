import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminStore = create<AdminState>()(
    persist(
        set => ({
            isAdmin: false,
            auctionCode: '',
            auctionInfo: null,
            setAdmin: auction =>
                set({
                    isAdmin: true,
                    auctionCode: auction.code,
                    auctionInfo: auction
                }),
            logoutAdmin: () => set({ isAdmin: false, auctionCode: '', auctionInfo: null })
        }),
        {
            name: 'admin-store'
        }
    )
);
