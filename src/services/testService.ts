import api from './api';

export const uploadExamFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/v1/exam/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
