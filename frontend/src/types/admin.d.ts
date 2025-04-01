interface AdminState {
    isAdmin: boolean;
    auctionCode: string;
    setAdmin: (code: string) => void;
    logoutAdmin: () => void;
}
