import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '@/app';

let mongoServer: MongoMemoryServer;
let code: string;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Auction Flow Integration Test', () => {
    it('1. should create an auction', async () => {
        const res = await request(app).post('/api/auction/create').send({
            clubName: '롤소모임',
            hostName: '최우제',
            auctionTitle: '2025 스프링 내전',
            memberCount: 10,
            adminPassword: '1234',
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();

        code = res.body.data.code;
    });

    it('2. should login and return token', async () => {
        const res = await request(app).post('/api/auction/admin-login').send({
            code,
            adminPassword: '1234',
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.code).toBeDefined();
    });

    it('3. should import users', async () => {
        const res = await request(app)
            .post(`/api/auction/${code}/users`)
            .send({ users: [{ nickname: 'aaa', tag: '1234', weight: 1500 }] });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('4. should set captains', async () => {
        const res = await request(app)
            .patch(`/api/auction/${code}/users/captains`)
            .send({ captains: ['aaa'] });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
