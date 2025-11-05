import mongoose from 'mongoose';
import { createClient } from 'redis';

import { server } from './app';

const MONGO_URI = process.env.MONGO_URI || '';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const PORT = process.env.PORT || 8080;

const redisClient = createClient({ url: REDIS_URL });

mongoose
    .connect(MONGO_URI)
    .then(async () => {
        console.log('🧩 BACKEND: MongoDB connected!');

        try {
            await redisClient.connect();
            console.log('⚡ BACKEND: Redis connected!');
            server.listen(PORT, () => {
                console.log(`🚀 BACKEND: Server listening on port ${PORT}`);
            });
        } catch (redisErr) {
            console.error('❌ BACKEND: Redis connection error:', redisErr);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('❌ BACKEND: MongoDB connection error:', err);
        process.exit(1);
    });

export { redisClient };
