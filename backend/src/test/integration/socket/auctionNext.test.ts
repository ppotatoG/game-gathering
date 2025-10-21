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

describe('auction:next-user', () => {
    let io: Server;
    let httpServer: ReturnType<typeof createServer>;
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
            handleNextUser(io, socket);
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

    test('should emit auction:show-user after auction:next-user', done => {
        const client = Client(url);

        client.once('auction:show-user', data => {
            try {
                expect(data).toHaveProperty('nickname');
                expect(data).toHaveProperty('round');
                client.close();
                done();
            } catch (err) {
                client.close();
                done(err);
            }
        });

        client.once('connect', () => {
            client.emit('auction:reset', { auctionCode: AUCTION_CODE });

            client.once('auction:reset-complete', () => {
                client.emit('auction:next-user', { auctionCode: AUCTION_CODE });
            });
        });
    }, 10000);
});
