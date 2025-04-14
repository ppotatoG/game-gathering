import { AuctionUserData } from '@/models/AuctionUser';

interface Bid {
    nickname: string;
    point: number;
    teamId: string;
}

export interface CaptainPoints {
    [nickname: string]: number;
}

/**
 * 경매 상태를 저장하는 구조. 각 auctionCode 마다 Map으로 관리됨.
 */
export interface AuctionState {
    /**
     * 현재 경매 중인 대상 유저
     */
    currentTarget: AuctionUserData | null;

    /**
     * 각 팀장이 입찰한 내역 (nickname, point, teamId)
     */
    captainBids: Bid[];

    /**
     * 지금까지 경매에 등장했던 유저 목록 (중복 X)
     */
    selectedUsers: AuctionUserData[];

    /**
     * 현재 라운드 수 (1부터 시작)
     */
    round: number;

    /**
     * 경매가 종료되었는지 여부
     */
    isFinished: boolean;

    /**
     * 각 팀장별 남은 포인트 (초기값 1000)
     */
    captainPoints: CaptainPoints;
}

export const auctionStateMap = new Map<string, AuctionState>();
