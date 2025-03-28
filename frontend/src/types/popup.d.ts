interface PopupItem {
    id: string;
    title: string;
    description: string;
    onClose: () => void;
    onSubmit: () => void;
    open: boolean;
}
