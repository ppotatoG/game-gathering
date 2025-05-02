import http from 'http';
import path from 'path';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';

import auctionRouter from '@/routes/auction';
import auctionSocket from '@/sockets/auction.socket';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const app = express();
app.use(cors());
app.use(express.json());

// create server + io instance
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' },
});

// 라우터 등록
app.use('/api/auction', auctionRouter(io));

// 소켓 등록
auctionSocket(io);

// 외부에서 app과 server를 둘 다 사용할 수 있도록 export
export { app, server, io };
