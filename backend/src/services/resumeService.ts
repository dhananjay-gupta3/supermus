import Resume from '../models/Resume';
import type { Document } from 'mongoose';

export const createResumeDocument = async (payload: unknown): Promise<Document> => {
  return Resume.create(payload);
};

export const findAllResumes = async (): Promise<Document[]> => {
  return Resume.find().sort({ updatedAt: -1 });
};

export const findResumeById = async (id: string): Promise<Document | null> => {
  return Resume.findById(id);
};

export const updateResumeDocument = async (id: string, payload: unknown): Promise<Document | null> => {
  return Resume.findByIdAndUpdate(id, payload as Record<string, unknown>, {
    new: true,
    runValidators: true
  });
};

export const deleteResumeById = async (id: string): Promise<Document | null> => {
  return Resume.findByIdAndDelete(id);
};
