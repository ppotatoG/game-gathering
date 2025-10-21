import { createServer } from 'http';
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
import handleNextUser from '@/sockets/handlers/auction/handleNextUser';
import handleStartBid from '@/sockets/handlers/auction/handleStartBid';
import { auctionStateMap } from '@/sockets/stores/auctionStateMap';

describe('auction:start-bid socket test', () => {
    let io: Server;
    let httpServer: ReturnType<typeof createServer>;
    let mongod: MongoMemoryServer;
    let port: number;
    let url: string;

    // helper: wait until currentTarget is set
    const waitUntil = (check: () => boolean, timeout = 1000) =>
        new Promise<void>((resolve, reject) => {
            const interval = setInterval(() => {
                if (check()) {
                    clearInterval(interval);
                    resolve();
                }
            }, 20);
            setTimeout(() => {
                clearInterval(interval);
                reject(new Error('Timeout waiting for condition'));
            }, timeout);
        });

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);

        const app = express();
        httpServer = createServer(app);
        io = new Server(httpServer, { cors: { origin: '*' } });

        io.on('connection', socket => {
            handleInitAuction(io, socket);
            handleNextUser(io, socket);
            handleStartBid(io, socket);
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

    test('should emit auction:start-bid after proper reset and next-user', done => {
        const client = Client(url);

        client.once('auction:start-bid', data => {
            try {
                expect(data).toHaveProperty('target');
                expect(data).toHaveProperty('round');
                expect(data).toHaveProperty('endAt');
                client.close();
                done();
            } catch (err) {
                client.close();
                done(err);
            }
        });

        client.once('connect', () => {
            // 🔥 reset-complete listener 먼저 등록
            client.once('auction:reset-complete', () => {
                client.once('auction:show-user', async () => {
                    await waitUntil(() => {
                        const state = auctionStateMap.get(AUCTION_CODE);
                        return !!state?.currentTarget;
                    });

                    client.emit('auction:start-bid', { auctionCode: AUCTION_CODE });
                });

                client.emit('auction:next-user', { auctionCode: AUCTION_CODE });
            });

            // 🔥 그 다음에 emit
            client.emit('auction:reset', { auctionCode: AUCTION_CODE });
        });
    }, 10000);
});
