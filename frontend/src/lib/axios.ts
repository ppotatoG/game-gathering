import axios from 'axios';

import { useLoadingStore } from '@/store/useLoadingStore';
import { useToastStore } from '@/store/useToastStore';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || ''
});

// 요청 인터셉터
instance.interceptors.request.use(
    config => {
        const { startLoading } = useLoadingStore.getState();
        startLoading();

        // 👉 디버그 추가
        console.log('[Request]', {
            baseURL: config.baseURL,
            url: config.url,
            method: config.method,
            data: config.data,
            fullURL: (config.baseURL || '') + (config.url || '')
        });

        return config;
    },
    error => {
        const { stopLoading } = useLoadingStore.getState();
        stopLoading();
        return Promise.reject(error);
    }
);

// 응답 인터셉터
instance.interceptors.response.use(
    response => {
        const { stopLoading } = useLoadingStore.getState();
        const { addToast } = useToastStore.getState();

        stopLoading();

        // 👉 디버그 추가
        console.log('[Response]', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });

        const message = response?.data?.message;
        addToast('success', message || '요청이 성공했습니다.');

        return response;
    },
    error => {
        const { stopLoading } = useLoadingStore.getState();
        const { addToast } = useToastStore.getState();

        stopLoading();

        // 👉 디버그 추가
        console.log('[Response Error]', {
            url: error?.config?.url,
            status: error?.response?.status,
            data: error?.response?.data
        });

        const message = error?.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
        addToast('error', message);
        return Promise.reject(error);
    }
);

export default instance;
