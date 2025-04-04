import axios from 'axios';

import { sleep } from '@/utils/sleep';

interface SyncResult {
    mainRole: string | null;
    subRole: string | null;
    mostChampion: string | null;
}

const mostCommon = (arr: string[]) =>
    arr.reduce(
        (acc, cur) => {
            acc[cur] = (acc[cur] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

export const fetchUserRiotData = async (
    nickname: string,
    tag: string,
    RIOT_API_KEY: string
): Promise<SyncResult | null> => {
    try {
        const matchRegion = 'asia';

        const accountRes = await axios.get(
            `https://${matchRegion}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
                nickname
            )}/${encodeURIComponent(tag)}`,
            {
                headers: {
                    'X-Riot-Token': RIOT_API_KEY.trim(),
                },
            }
        );

        const { puuid } = accountRes.data;
        console.log('[📦 puuid]', puuid);

        const matchIdsRes = await axios.get(
            `https://${matchRegion}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&start=0&count=20`,
            { headers: { 'X-Riot-Token': RIOT_API_KEY.trim() } }
        );

        const matchDetails = await Promise.all(
            matchIdsRes.data.map((matchId: string) =>
                axios
                    .get(
                        `https://${matchRegion}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
                        { headers: { 'X-Riot-Token': RIOT_API_KEY.trim() } }
                    )
                    .then(res => res.data)
            )
        );

        const thisPlayerGames = matchDetails
            .filter(game => game.info.queueId === 420)
            .map(game => game.info.participants.find((p: { puuid: string }) => p.puuid === puuid))
            .filter(Boolean);

        const positions = thisPlayerGames.map(p => p.teamPosition).filter(Boolean);
        const champions = thisPlayerGames.map(p => p.championName).filter(Boolean);

        const sortedPositions = Object.entries(mostCommon(positions)).sort((a, b) => b[1] - a[1]);
        const sortedChamps = Object.entries(mostCommon(champions)).sort((a, b) => b[1] - a[1]);

        return {
            mainRole: sortedPositions[0]?.[0] ?? null,
            subRole: sortedPositions[1]?.[0] ?? null,
            mostChampion: sortedChamps[0]?.[0] ?? null,
        };
    } catch (e: any) {
        console.error(`[❌ Riot 연동 실패: ${nickname}]`, e.message);
        if (e.response) {
            console.error('[📛 응답 코드]', e.response.status);
            console.error('[📛 응답 바디]', e.response.data);
        }
        return null;
    } finally {
        await sleep(1200);
    }
};
