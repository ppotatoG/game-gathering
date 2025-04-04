import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { adminLogin } from '@/services/auctionService';
import { useAdminStore } from '@/store/useAdmin';

export const useAdminLogin = (code: string) => {
    const navigate = useNavigate();
    const { setAdmin } = useAdminStore();
    const [form, setForm] = useState({ adminPassword: '' });

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            const res = await adminLogin(code, form.adminPassword);
            if (res.success) {
                setAdmin(res.data);
                navigate(`/auction/${code}/admin`);
            }
        } catch (err) {
            console.error('관리자 로그인 실패:', err);
        }
    }, [code, form.adminPassword, navigate, setAdmin]);

    return { form, handleChange, handleSubmit };
};
