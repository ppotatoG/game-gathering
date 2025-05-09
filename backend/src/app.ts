import http from 'http';
import path from 'path';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';

import auctionRouter from '@/routes/auction';
import auctionSocket from '@/sockets/auction.socket';
import { ClientToServerEvents, ServerToClientEvents, AuctionSocketData } from '@/types/socket';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io: Server<ClientToServerEvents, ServerToClientEvents, never, AuctionSocketData> = new Server(
    server,
    {
        cors: { origin: '*' },
    }
);

// 라우터 등록
app.use('/api/auction', auctionRouter(io));

// 소켓 등록
auctionSocket(io);

export { app, server, io };
