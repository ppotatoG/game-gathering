import $axios from '@/lib/axios';

export const registerUser = async () => {
  const response = await $axios.post('/api/user');
  return response.data;
}

export const getUsers = async () => {
  const response = await $axios.get('/api/user');
  return response.data;
}
