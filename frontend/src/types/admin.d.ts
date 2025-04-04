interface AdminAuction {
    _id: string;
    code: string;
    clubName: string;
    hostName: string;
    auctionTitle: string;
    memberCount: number;
    captainCount: number;
    createdAt: string;
    updatedAt: string;
}

interface AdminState {
    isAdmin: boolean;
    auctionCode: string;
    auctionInfo: AdminAuction | null;
    setAdmin: (auction: AdminAuction) => void;
    logoutAdmin: () => void;
}
