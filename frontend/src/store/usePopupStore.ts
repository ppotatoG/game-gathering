import { nanoid } from 'nanoid';
import { create } from 'zustand';

interface PopupStoreState {
  popups: PopupItem[];
  showPopup: ( popup: Omit<PopupItem, 'id'> ) => void;
  closePopup: ( id: string ) => void;
}

export const usePopupStore = create<PopupStoreState>( ( set ) => ( {
    popups: [],
    showPopup: ( popup ) => {
        const id = nanoid();
        const newPopup: PopupItem = { id, ...popup };
        set( ( state ) => ( {
            popups: [...state.popups, newPopup],
        } ) );
    },
    closePopup: ( id ) =>
        set( ( state ) => ( {
            popups: state.popups.filter( ( popup ) => popup.id !== id ),
        } ) ),
} ) );
