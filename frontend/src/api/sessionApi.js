import axiosInstance from './axiosInstance';

export const createSession = async (sessionData) => {
  const { data } = await axiosInstance.post('/sessions', sessionData);
  return data;
};

export const getSessions = async () => {
  const { data } = await axiosInstance.get('/sessions');
  return data;
};

export const closeSession = async (id) => {
  const { data } = await axiosInstance.put(`/sessions/${id}/close`);
  return data;
};