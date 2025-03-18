import $axios from '@/lib/axios';

export const createClub = async (clubName: string, ownerId: string, password: string) => {
  const response = await $axios.post('/api/club', { clubName, ownerId, password });
  return response.data;
}

export const loginClub = async (ownerId: string, password: string) => {
  const response = await $axios.post('/api/register/club', { ownerId, password });
  return response.data;
}
