import http from 'http';
import path from 'path';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import auctionRouter from '@/routes/auction';
import auctionSocket from '@/sockets/auction.socket';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const app = express();
const server = http.createServer(app);

const MONGO_URI = process.env.MONGO_URI || '';
const PORT = process.env.PORT || 8080;

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.use(cors());
app.use(express.json());

app.use('/api/auction', auctionRouter(io));

auctionSocket(io);

console.log('💬 MONGO_URI:', MONGO_URI);

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('🧩 BACKEND: MongoDB connected!');
        server.listen(PORT, () => {
            console.log(`🚀 BACKEND: Server listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ BACKEND: MongoDB connection error:', err);
    });
