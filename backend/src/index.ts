import mongoose from 'mongoose';

import { server } from './app';

const MONGO_URI = process.env.MONGO_URI || '';
const PORT = process.env.PORT || 8080;

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
