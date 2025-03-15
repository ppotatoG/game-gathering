import axios from 'axios';

import { useLoadingStore } from '@/store/loading';
import { useToastStore } from '@/store/toast';

const $axios = axios.create({
  withCredentials: true,
});

$axios.interceptors.request.use(
  (config) => {
    useLoadingStore.getState().increase();

    return config;
  },
  (error) => {
    useLoadingStore.getState().decrease();
    return Promise.reject(error);
  }
);

$axios.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().decrease();
    const endpoint = response.config.url?.replace(/^\/api\//, '') || '';
    useToastStore.getState().addToast(`[${endpoint}] ${response.data?.message || 'success'}`, 'success');
    return response;
  },
  (error) => {
    useLoadingStore.getState().decrease();
    return Promise.reject(error);
  }
);


export default $axios;
