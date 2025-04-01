import { useEffect, useState, useCallback } from 'react';

import {
    saveAuctionUsers,
    getAuctionUsers,
    fetchRiotDataForUsers
} from '@/services/auctionService';
import { parseAuctionExcel } from '@/utils/excel';

export const useAuctionUsers = (code: string) => {
    const [users, setUsers] = useState<AuctionUser[]>([]);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const importUsersFromExcel = useCallback(
        async (file: File) => {
            const parsed: AuctionUserInput[] = await parseAuctionExcel(file);
            await saveAuctionUsers(code, parsed);
            await fetchUsers();
        },
        [code]
    );

    const fetchUsers = useCallback(async () => {
        try {
            const fetched = await getAuctionUsers(code);
            setUsers(fetched || []);
            const now = new Date().toLocaleString();
            setLastUpdated(fetched.length > 0 ? now : null); // 후에 createdAt으로 대체 가능
        } catch {
            setUsers([]);
        }
    }, [code]);

    const updateUserWithRiotData = useCallback(async () => {
        await fetchRiotDataForUsers(code);
        setLastUpdated(new Date().toLocaleString());
    }, [code]);

    useEffect(() => {
        if (code) fetchUsers();
    }, [code, fetchUsers]);

    return {
        users,
        lastUpdated,
        importUsersFromExcel,
        updateUserWithRiotData
    };
};
