type PopupType = 'success' | 'error' | 'info';

interface PopupItem {
    id: string;
    title: string;
    description: string;
    onSubmit: () => void;
    submitText?: string;
    popupType: PopupType;
}
