import { nanoid } from 'nanoid';
import { create } from 'zustand';

type PopupItemInput = Omit<PopupItem, 'id' | 'popupType'> & {
    popupType?: PopupType;
};

interface PopupStoreState {
    popups: PopupItem[];
    showPopup: (popup: PopupItemInput) => void;
    closePopup: (id: string) => void;
}

export const usePopupStore = create<PopupStoreState>(set => ({
    popups: [],
    showPopup: popup => {
        const id = nanoid();
        const popupType = popup.popupType ?? 'info';
        const newPopup: PopupItem = { id, ...popup, popupType };
        set(state => ({
            popups: [...state.popups, newPopup]
        }));
    },
    closePopup: id =>
        set(state => ({
            popups: state.popups.filter(popup => popup.id !== id)
        }))
}));
