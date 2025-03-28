import { create } from 'zustand';

interface UserStoreState {
    userInfo: UserInfo;
    setUserInfo: (info: UserInfo) => void;
    clearUserInfo: () => void;
}

const initialState: UserInfo = {
    token: '',
    tokenExpiresAt: '',
    userDetails: {
        name: '',
        email: '',
        password: ''
    }
};
export const useUserStore = create<UserStoreState>(set => ({
    userInfo: initialState,
    setUserInfo: info => set({ userInfo: info }),
    clearUserInfo: () => set({ userInfo: initialState })
}));
