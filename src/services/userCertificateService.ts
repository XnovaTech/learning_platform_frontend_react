import type { UserCertificate } from '@/types/certificate';
import api from './api';

export const getStudentCertificates = async (): Promise<UserCertificate[]> => {
  try {
    const { data } = await api.get(`/v1/student/certificates`);
    return data?.data ?? [];
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const downloadCertificate = async (certificateId: number,className:string): Promise<Blob> => {
  try {
    const response = await api.get(`/v1/certificates/${certificateId}/download`, {
      responseType: 'blob',
    });

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${className}-certificate.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return blob;
  } catch (error: any) {
    throw new Error(error.response.data.message || error.message);
  }
};

export const downloadCertificates = async (classId: number, className: string): Promise<Blob> => {
  try {
    const response = await api.get<Blob>(`/v1/classes/${classId}/certificates/download`, {
      responseType: 'blob',
    });

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${className}-certificates.zip`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return blob;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to download certificates');
  }
};



