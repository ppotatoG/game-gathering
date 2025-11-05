import { REDIS_STATE_KEY, REDIS_BIDS_KEY, REDIS_USERS_KEY } from '@/constants/redis';
import { redisClient } from '@/index';
import { AuctionUserData } from '@/models/AuctionUser';
import { AuctionState, Bid } from '@/sockets/stores/auctionStateMap';

export async function setAuctionState(code: string, state: AuctionState): Promise<void> {
    const stateKey = REDIS_STATE_KEY(code);

    await redisClient.hSet(stateKey, {
        currentTarget: JSON.stringify(state.currentTarget),
        round: state.round.toString(),
        isFinished: state.isFinished ? 'true' : 'false',
        isReady: state.isReady ? 'true' : 'false',
        isBidding: state.isBidding ? 'true' : 'false',
        captainPoints: JSON.stringify(state.captainPoints),
        ...(state.endAt && { endAt: state.endAt.toString() }),
    });

    await redisClient.set(REDIS_USERS_KEY(code), JSON.stringify(state.selectedUsers));
    if (state.captainBids.length === 0) {
        await redisClient.del(REDIS_BIDS_KEY(code));
    }
}

export async function getAuctionState(code: string): Promise<AuctionState | null> {
    const stateKey = REDIS_STATE_KEY(code);
    const stateData = await redisClient.hGetAll(stateKey);

    if (Object.keys(stateData).length === 0) {
        return null;
    }

    const selectedUsersJson = await redisClient.get(REDIS_USERS_KEY(code));
    const selectedUsers: AuctionUserData[] = selectedUsersJson ? JSON.parse(selectedUsersJson) : [];
    const rawBids = await redisClient.zRangeWithScores(REDIS_BIDS_KEY(code), 0, -1);
    const captainBids: Bid[] = rawBids.map(item => ({
        nickname: item.value,
        point: item.score,
        teamId: 'N/A',
    }));

    const state: AuctionState = {
        round: parseInt(stateData.round || '0', 10),
        isFinished: stateData.isFinished === 'true',
        isReady: stateData.isReady === 'true',
        isBidding: stateData.isBidding === 'true',
        currentTarget: stateData.currentTarget ? JSON.parse(stateData.currentTarget) : null,
        captainPoints: stateData.captainPoints ? JSON.parse(stateData.captainPoints) : {},
        selectedUsers: selectedUsers,
        captainBids: captainBids,
        timerId: undefined,
        endAt: stateData.endAt ? parseInt(stateData.endAt, 10) : undefined,
    };

    return state;
}
