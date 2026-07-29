import axiosInstance from './axiosInstance';

export const loginAdmin = async (email, password) => {
  const { data } = await axiosInstance.post('/auth/login', { email, password });
  return data;
};