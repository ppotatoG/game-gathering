import { create } from 'zustand';

interface UserState {
  id: string;
  nickname: string;
  email: string;
  setUser: (user: Partial<UserState>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: '',
  nickname: '',
  email: '',
  setUser: (user) => set((state) => ({ ...state, ...user })),
  clearUser: () => set({ id: '', nickname: '', email: '' }),
}));
