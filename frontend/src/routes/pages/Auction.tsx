import { useEffect, useState } from 'react';

import ChatBox from '@/components/Auction/ChatBox';
import socket from '@/lib/socket';

export default function Auction() {
    const [messages, setMessages] = useState<{ user: string; message: string }[]>( [] );
    const [input, setInput] = useState( '' );
    const nickname = localStorage.getItem( 'nickname' ) || '익명';

    const handleSend = () => {
        if ( !input.trim() ) return;
        socket.emit( 'chatMessage', { user: nickname, message: input } );
        setInput( '' );
    };

    useEffect( () => {
        socket.on( 'chatMessage', ( data ) => {
            setMessages( ( prev ) => [...prev, data] );
        } );

        return () => {
            socket.off( 'chatMessage' );
        };
    }, [] );

    return (
        <div style={{ maxWidth: 600, margin: '40px auto' }}>
            <ChatBox messages={messages} input={input} onChange={setInput} onSend={handleSend} />
        </div>
    );
}
