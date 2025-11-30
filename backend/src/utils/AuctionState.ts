import { REDIS_STATE_KEY, REDIS_BIDS_KEY, REDIS_USERS_KEY } from '@/constants/redis';
import { redisClient } from '@/index';
import { AuctionUserData } from '@/models/AuctionUser';
import { AuctionState as AuctionStateType, Bid } from '@/sockets/stores/auctionStateMap';

export class AuctionState {
    private code: string;
    private stateKey: string;
    private bidsKey: string;
    private usersKey: string;

    constructor(code: string) {
        this.code = code;
        this.stateKey = REDIS_STATE_KEY(code);
        this.bidsKey = REDIS_BIDS_KEY(code);
        this.usersKey = REDIS_USERS_KEY(code);
    }

    async getFullState(): Promise<AuctionStateType | null> {
        const stateData = await redisClient.hGetAll(this.stateKey);

        if (Object.keys(stateData).length === 0) {
            return null;
        }

        const selectedUsersJson = await redisClient.get(this.usersKey);
        const selectedUsers: AuctionUserData[] = selectedUsersJson
            ? JSON.parse(selectedUsersJson)
            : [];

        const rawBids = await redisClient.zRangeWithScores(this.bidsKey, 0, -1);
        const captainBids: Bid[] = rawBids.map(item => ({
            nickname: item.value,
            point: item.score,
            teamId: 'N/A',
        }));

        const state: AuctionStateType = {
            round: parseInt(stateData.round || '0', 10),
            isFinished: stateData.isFinished === 'true',
            isReady: stateData.isReady === 'true',
            isBidding: stateData.isBidding === 'true',
            isPaused: stateData.isPaused === 'true',
            currentTarget: stateData.currentTarget ? JSON.parse(stateData.currentTarget) : null,
            captainPoints: stateData.captainPoints ? JSON.parse(stateData.captainPoints) : {},
            selectedUsers: selectedUsers,
            captainBids: captainBids,
            timerId: undefined,
            endAt: stateData.endAt ? parseInt(stateData.endAt, 10) : undefined,
        };

        return state;
    }

    async setFullState(state: AuctionStateType): Promise<void> {
        await redisClient.hSet(this.stateKey, {
            currentTarget: JSON.stringify(state.currentTarget),
            round: state.round.toString(),
            isFinished: state.isFinished ? 'true' : 'false',
            isReady: state.isReady ? 'true' : 'false',
            isBidding: state.isBidding ? 'true' : 'false',
            isPaused: state.isPaused ? 'true' : 'false',
            captainPoints: JSON.stringify(state.captainPoints),
            ...(state.endAt && { endAt: state.endAt.toString() }),
        });

        await redisClient.set(this.usersKey, JSON.stringify(state.selectedUsers));

        if (state.captainBids.length === 0) {
            await redisClient.del(this.bidsKey);
        }
    }

    async getCurrentTarget(): Promise<AuctionUserData | null> {
        const targetJson = await redisClient.hGet(this.stateKey, 'currentTarget');
        return targetJson ? JSON.parse(targetJson) : null;
    }

    async setIsBidding(isBidding: boolean): Promise<void> {
        await redisClient.hSet(this.stateKey, 'isBidding', isBidding ? 'true' : 'false');
    }

    async incrementRound(): Promise<number> {
        return redisClient.hIncrBy(this.stateKey, 'round', 1);
    }

    async addBid(bid: Bid): Promise<void> {
        await redisClient.zAdd(this.bidsKey, { score: bid.point, value: bid.nickname });
    }
}
