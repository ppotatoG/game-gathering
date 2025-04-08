import { Server, Socket } from 'socket.io';

export default function registerChatHandler(io: Server, socket: Socket) {
    socket.on('chatMessage', data => {
        io.emit('chatMessage', data);
    });
}
