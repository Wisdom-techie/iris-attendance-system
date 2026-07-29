import axiosInstance from './axiosInstance';

export const createStudent = async (studentData) => {
  const { data } = await axiosInstance.post('/students', studentData);
  return data;
};

export const getStudents = async (search = '') => {
  const { data } = await axiosInstance.get('/students', { params: { search } });
  return data;
};

export const deleteStudent = async (id) => {
  const { data } = await axiosInstance.delete(`/students/${id}`);
  return data;
};