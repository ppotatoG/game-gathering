import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createAuction } from '@/services/auctionService';
import { usePopupStore } from '@/store/usePopupStore';

export const useCreateAuction = () => {
    const navigate = useNavigate();
    const { showPopup } = usePopupStore();
    const [form, setForm] = useState<AuctionCreateRequest>({
        clubName: '',
        hostName: '',
        auctionTitle: '',
        memberCount: 10,
        adminPassword: ''
    });

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e?.preventDefault();

            try {
                const data = await createAuction({
                    ...form,
                    memberCount: Number(form.memberCount)
                });

                if (data.success && data.data?.code) {
                    const code = data.data.code;

                    showPopup({
                        title: '경매 생성 완료',
                        description: `경매 참가 주소는 /auction/${code} 입니다. 이 주소로만 참여 가능합니다.`,
                        submitText: '이동',
                        popupType: 'success',
                        onSubmit: () => {
                            navigate(`/auction/${code}`);
                        }
                    });
                }
            } catch (err) {
                console.error('경매 생성 실패:', err);
            }
        },
        [form, showPopup, navigate]
    );

    return { form, handleChange, handleSubmit };
};
