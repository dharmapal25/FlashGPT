import api from '../api';

export const checkAuthStatus = async () => {
  const res = await api.get('/auth/profile', { timeout: 8000 });
  return res.data?.user ?? null;
};