import { useEffect, useState, useCallback } from 'react';

import {
    saveAuctionUsers,
    getAuctionUsers,
    fetchRiotDataForUsers
} from '@/services/auctionService';
import { parseAuctionExcel } from '@/utils/excel';

export const useAuctionUsers = (code: string) => {
    const [users, setUsers] = useState<AuctionUserData[]>([]);
    const [riotFetched, setRiotFetched] = useState(false);

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
            setUsers(fetched.users || []);
            setRiotFetched(fetched.riotFetched);
        } catch {
            setUsers([]);
            setRiotFetched(false);
        }
    }, [code]);

    const deleteUsers = useCallback(async () => {
        await saveAuctionUsers(code, []);
        await fetchUsers();
    }, [code, fetchUsers]);

    const updateUserWithRiotData = useCallback(async () => {
        await fetchRiotDataForUsers(code);
    }, [code]);

    useEffect(() => {
        if (code) fetchUsers();
    }, [code, fetchUsers]);

    return {
        users,
        riotFetched,
        importUsersFromExcel,
        deleteUsers,
        updateUserWithRiotData
    };
};
