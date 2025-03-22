import http from 'http';
import path from 'path';

import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

dotenv.config( { path: path.resolve( __dirname, './.env.local' ) } );

const app = express();
const server = http.createServer( app );

const MONGO_URI = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
const PORT = process.env.PORT || 8080;

const io = new Server( server, {
    cors: {
        origin: '*',
    },
} );

io.on( 'connection', ( socket ) => {
    console.log( '🔌 User connected:', socket.id );

    socket.on( 'chatMessage', ( data ) => {
        io.emit( 'chatMessage', data );
    } );

    socket.on( 'disconnect', () => {
        console.log( '❌ User disconnected:', socket.id );
    } );
} );

console.log( '💬 MONGO_URI:', MONGO_URI );

mongoose
    .connect( MONGO_URI )
    .then( () => {
        console.log( '🧩 BACKEND: MongoDB connected!' );
        server.listen( PORT, () => {
            console.log( `🚀 BACKEND: Server listening on port ${PORT}` );
        } );
    } )
    .catch( ( err ) => {
        console.error( '❌ BACKEND: MongoDB connection error:', err );
    } );
