import { createServer, Server as HTTPServer } from 'http';
import { AddressInfo } from 'net';

import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import Client from 'socket.io-client';

import { dummyCaptains } from '@/constants/test/dummyCaptains';
import { dummyUsers } from '@/constants/test/dummyUsers';
import { AUCTION_CODE } from '@/constants/test/socketTestConstants';
import AuctionUser from '@/models/AuctionUser';
import handleInitAuction from '@/sockets/handlers/auction/handleInitAuction';
import { auctionStateMap } from '@/sockets/stores/auctionStateMap';

describe('auction:init socket', () => {
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
            handleInitAuction(io, socket);
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

    test('should initialize auction state correctly', done => {
        const client = Client(url);

        client.on('connect', () => {
            client.emit('auction:reset', { auctionCode: AUCTION_CODE });
        });

        client.on('auction:reset-complete', () => {
            const state = auctionStateMap.get(AUCTION_CODE);

            expect(state).toBeDefined();
            expect(state?.captainPoints).toBeDefined();

            const expectedCaptains = dummyCaptains.filter(name =>
                dummyUsers.some(u => u.nickname === name)
            );

            expectedCaptains.forEach(captain => {
                expect(state?.captainPoints[captain]).toBe(1000);
            });

            expect(state?.round).toBe(0);
            expect(state?.isFinished).toBe(false);
            expect(state?.isReady).toBe(false);
            expect(state?.isBidding).toBe(false);
            expect(state?.currentTarget).toBeNull();
            expect(state?.captainBids).toEqual([]);
            expect(state?.selectedUsers).toEqual([]);

            client.close();
            done();
        });
    });
});
