import { create } from 'zustand';

interface PopupState {
  isOpen: boolean;
  message: string;
  onClick?: () => void;
  closePopup: () => void;
  openPopup: (message: string, onClick?: () => void) => void;
}

export const usePopupStore = create<PopupState>((set) => ({
  isOpen: false,
  message: '',
  onClick: undefined,
  openPopup: (message, onClick) => set({ isOpen: true, message, onClick }),
  closePopup: () => set({ isOpen: false, message: '', onClick: undefined }),
}));
