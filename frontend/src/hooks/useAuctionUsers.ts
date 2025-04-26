import { useEffect, useState, useCallback } from 'react';

import {
    saveAuctionUsers,
    getAuctionUsers,
    fetchRiotDataForUsers,
    updateCaptains
} from '@/services/auctionService';
import { parseAuctionExcel } from '@/utils/excel';
import { parseUserString } from '@/utils/parseUserString';

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

    const importUsersFromText = useCallback(
        async (text: string) => {
            const lines = text
                .split('\n')
                .map(line => line.trim())
                .filter(Boolean);

            const parsed = lines.map(line => {
                const { nickname, tag, weight } = parseUserString(line);
                return { nickname, tag, weight };
            });

            await saveAuctionUsers(code, parsed);
            await fetchUsers();
        },
        [code]
    );

    const saveCaptains = useCallback(
        async (captains: string[]) => {
            await updateCaptains(code, captains);
            await fetchUsers();
        },
        [code, fetchUsers]
    );

    useEffect(() => {
        if (code) fetchUsers();
    }, [code, fetchUsers]);

    return {
        users,
        riotFetched,
        importUsersFromExcel,
        deleteUsers,
        updateUserWithRiotData,
        importUsersFromText,
        saveCaptains
    };
};
