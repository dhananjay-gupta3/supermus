import { api } from './api';
import type { ResumeData } from '@/types/resume';

export type ResumeResponse = ResumeData & {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const createResume = async (resume: ResumeData): Promise<ResumeResponse> => {
  const response = await api.post('/resume', resume);
  return response.data.data;
};

export const getAllResumes = async (): Promise<ResumeResponse[]> => {
  const response = await api.get('/resume');
  return response.data.data;
};

export const getResumeById = async (id: string): Promise<ResumeResponse> => {
  const response = await api.get(`/resume/${id}`);
  return response.data.data;
};

export const updateResume = async (id: string, resume: ResumeData): Promise<ResumeResponse> => {
  const response = await api.put(`/resume/${id}`, resume);
  return response.data.data;
};

export const deleteResume = async (id: string): Promise<ResumeResponse> => {
  const response = await api.delete(`/resume/${id}`);
  return response.data.data;
};
