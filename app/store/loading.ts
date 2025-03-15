import { create } from 'zustand';

interface LoadingState {
  loadingCount: number;
  increase: () => void;
  decrease: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  loadingCount: 0,
  increase: () => set((state) => ({ loadingCount: state.loadingCount + 1 })),
  decrease: () => set((state) => ({ loadingCount: Math.max(0, state.loadingCount - 1) })),
}));
