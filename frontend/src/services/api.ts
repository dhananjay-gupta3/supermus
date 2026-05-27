import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const saveResume = async (resume: unknown) => {
  const response = await api.post('/resume', resume);
  return response.data;
};

export const fetchResume = async (id: string) => {
  const response = await api.get(`/resume/${id}`);
  return response.data;
};
