import axiosInstance from './axiosInstance';

export const enrollStudentIris = async (studentId, imageBlob) => {
  const formData = new FormData();
  formData.append('irisImage', imageBlob, 'iris-capture.jpg');

  const { data } = await axiosInstance.post(`/enrollment/${studentId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getEnrollmentHistory = async (studentId) => {
  const { data } = await axiosInstance.get(`/enrollment/${studentId}`);
  return data;
};