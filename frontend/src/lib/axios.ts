import axios from 'axios';

import { useLoadingStore } from '@/store/useLoadingStore';
import { useToastStore } from '@/store/useToastStore';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || ''
});

instance.interceptors.request.use(
    config => {
        const { startLoading } = useLoadingStore.getState();
        startLoading();
        return config;
    },
    error => {
        const { stopLoading } = useLoadingStore.getState();
        stopLoading();
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    response => {
        const { stopLoading } = useLoadingStore.getState();
        const { addToast } = useToastStore.getState();

        stopLoading();

        const message = response?.data?.message;
        addToast('success', message || '요청이 성공했습니다.');

        return response;
    },
    error => {
        const { stopLoading } = useLoadingStore.getState();
        const { addToast } = useToastStore.getState();

        stopLoading();
        const message = error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
        addToast('error', message);
        return Promise.reject(error);
    }
);

export default instance;
