import { Socket } from 'socket.io';

export interface ClientToServerEvents {
    'auction:check-nickname': (
        payload: { auctionCode: string; nickname: string },
        callback: (ok: boolean) => void
    ) => void;
    'auction:join': (payload: { auctionCode: string; nickname: string; isAdmin: boolean }) => void;
    'auction:leave': () => void;
}

export interface ServerToClientEvents {
    'join:denied': (message: string) => void;
}

export interface AuctionSocketData {
    nickname?: string;
    auctionCode?: string;
}

export type AuctionSocket = Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    never,
    AuctionSocketData
>;
