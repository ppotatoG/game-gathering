import { useEffect } from 'react';

import socket from '@/lib/socket';

export const useAuctionSocket = ({
    setTargetUser,
    setBids,
    setSelectedUser
}: {
    setTargetUser: (val: string) => void;
    setBids: (val: any[]) => void;
    setSelectedUser: (val: any) => void;
}) => {
    useEffect(() => {
        socket.on('auction:show-user', data => {
            setTargetUser(data.targetUser);
            setBids([]);
        });

        socket.on('auction:selected', data => {
            setSelectedUser(data);
        });

        return () => {
            socket.off('auction:show-user');
            socket.off('auction:selected');
        };
    }, []);
};
