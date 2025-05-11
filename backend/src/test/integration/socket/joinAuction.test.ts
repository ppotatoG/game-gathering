import { createServer, Server as HTTPServer } from 'http';
import { AddressInfo } from 'net';

import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import Client from 'socket.io-client';

import { dummyCaptains } from '@/constants/test/dummyCaptains';
import { dummyUsers } from '@/constants/test/dummyUsers';
import {
    ADMIN_NICKNAME,
    AUCTION_CODE,
    DUPLICATE_NICKNAME,
    TEAM_CAPTAIN,
    UNKNOWN_NICKNAME,
} from '@/constants/test/socketTestConstants';
import AuctionUser from '@/models/AuctionUser';
import registerConnectionHandlers from '@/sockets/handlers/connectionHandler';
import { AuctionSocket } from '@/types/socket';

const ADMIN_PAYLOAD = {
    auctionCode: AUCTION_CODE,
    nickname: ADMIN_NICKNAME,
    isAdmin: true,
};

const TEAM_PAYLOAD = {
    auctionCode: AUCTION_CODE,
    nickname: TEAM_CAPTAIN,
    isAdmin: false,
};

const UNKNOWN_PAYLOAD = {
    auctionCode: AUCTION_CODE,
    nickname: UNKNOWN_NICKNAME,
    isAdmin: false,
};

const DUPLICATE_PAYLOAD = {
    auctionCode: AUCTION_CODE,
    nickname: DUPLICATE_NICKNAME,
    isAdmin: false,
};

describe('auction:join socket', () => {
    let io: Server;
    let httpServer: HTTPServer;
    let mongod: MongoMemoryServer;
    let port: number;
    let url: string;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);

        const app = express();
        httpServer = createServer(app);

        io = new Server(httpServer, { cors: { origin: '*' } });
        io.on('connection', socket => {
            registerConnectionHandlers(io, socket as AuctionSocket);
        });

        await new Promise<void>(resolve => httpServer.listen(() => resolve()));
        port = (httpServer.address() as AddressInfo).port;
        url = `http://localhost:${port}`;

        await AuctionUser.create({
            code: AUCTION_CODE,
            users: dummyUsers.map(user => ({
                ...user,
                isCaptain: dummyCaptains.includes(user.nickname),
            })),
        });
    });

    afterAll(async () => {
        io.close();
        httpServer.close();
        await mongoose.disconnect();
        await mongod.stop();
    });

    test('admin should join successfully', done => {
        const client = Client(url);
        client.emit('auction:join', ADMIN_PAYLOAD);

        client.on('connect', () => {
            expect(client.connected).toBe(true);
            client.close();
            done();
        });
    });

    test('registered captain should join successfully', done => {
        const client = Client(url);
        client.emit('auction:join', TEAM_PAYLOAD);

        client.on('connect', () => {
            expect(client.connected).toBe(true);
            client.close();
            done();
        });
    });

    test('unregistered nickname should be denied', done => {
        const client = Client(url);
        client.on('join:denied', (msg: string) => {
            expect(msg).toBe('등록된 팀장이 아닙니다.');
            client.close();
            done();
        });

        client.emit('auction:join', UNKNOWN_PAYLOAD);
    });

    test('duplicate nickname should be denied', done => {
        const first = Client(url);
        const second = Client(url);

        first.on('connect', () => {
            first.emit('auction:join', DUPLICATE_PAYLOAD);

            setTimeout(() => {
                second.on('join:denied', (msg: string) => {
                    expect(msg).toBe('이미 사용 중인 닉네임입니다.');
                    first.close();
                    second.close();
                    done();
                });

                second.emit('auction:join', DUPLICATE_PAYLOAD);
            }, 300);
        });
    });
});
