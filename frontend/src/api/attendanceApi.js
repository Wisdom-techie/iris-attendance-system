import axiosInstance from './axiosInstance';

export const verifyAttendance = async (studentId, sessionId, imageBlob) => {
  const formData = new FormData();
  formData.append('studentId', studentId);
  formData.append('sessionId', sessionId);
  formData.append('capturedImage', imageBlob, 'verification.jpg');

  const { data } = await axiosInstance.post('/attendance/verify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getSessionAttendance = async (sessionId) => {
  const { data } = await axiosInstance.get(`/attendance/session/${sessionId}`);
  return data;
};

export const getStudentAttendance = async (studentId) => {
  const { data } = await axiosInstance.get(`/attendance/student/${studentId}`);
  return data;
};