import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import socket from '@/lib/socket';
import { useAdminStore } from '@/store/useAdmin';
import { useToastStore } from '@/store/useToastStore';

export const useAuctionState = () => {
    const { code: urlCode } = useParams<{ code: string }>();
    const { isAdmin, auctionCode } = useAdminStore();
    const { addToast } = useToastStore();

    const [nickname, setNickname] = useState('');
    const [joined, setJoined] = useState(false);

    const isCodeValid = urlCode === auctionCode;

    // ✅ 관리자: 입장 시 nickname 없이 isAdmin만 보내서 입장
    useEffect(() => {
        if (isAdmin && isCodeValid && !joined) {
            setNickname('관리자');
            socket.emit('auction:join', { auctionCode: urlCode, isAdmin: true });
            setJoined(true);
        }
    }, [isAdmin, isCodeValid, urlCode, joined]);

    useEffect(() => {
        socket.on('join:denied', (msg: string) => {
            addToast('error', msg);
        });

        return () => {
            socket.off('join:denied');
        };
    }, [addToast]);

    const handleJoin = () => {
        if (!urlCode || !nickname.trim()) return;

        socket.emit(
            'auction:check-nickname',
            { auctionCode: urlCode, nickname },
            (isValid: boolean) => {
                if (!isValid) {
                    addToast('error', '입장할 수 없는 닉네임입니다.');
                    return;
                }

                socket.emit('auction:join', { nickname, auctionCode: urlCode });
                localStorage.setItem('nickname', nickname);

                setJoined(true);
                addToast('success', '입장 성공');
            }
        );
    };

    const shouldAskNickname = !isAdmin && !joined;

    return {
        code: urlCode || '',
        isAdmin,
        joined,
        nickname,
        setNickname,
        handleJoin,
        shouldAskNickname
    };
};
