import { useEffect } from 'react';

import socket from '@/lib/socket';

export const useAuctionSocket = ({
    setTargetUser,
    setBids,
    setAuctionState
}: {
    setTargetUser: (val: AuctionUserData) => void;
    setBids: (val: Bid[]) => void;
    setAuctionState: (val: AuctionState) => void;
}) => {
    useEffect(() => {
        socket.on('auction:show-user', data => {
            setTargetUser(data);
            setBids([]);
        });

        socket.on('auction:selected', data => {
            setAuctionState(data);
        });

        return () => {
            socket.off('auction:show-user');
            socket.off('auction:selected');
        };
    }, []);
};
