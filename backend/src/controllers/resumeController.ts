import type { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import {
  createResumeDocument,
  deleteResumeById,
  findAllResumes,
  findResumeById,
  updateResumeDocument
} from '../services/resumeService';

const buildPayload = (body: unknown) => {
  const data = body as Record<string, unknown>;

  return {
    fullName: typeof data.fullName === 'string' ? data.fullName : '',
    title: typeof data.title === 'string' ? data.title : '',
    bio: typeof data.bio === 'string' ? data.bio : '',
    skills: Array.isArray(data.skills) ? data.skills : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    experience: Array.isArray(data.experience) ? data.experience : []
  };
};

export const getAllResumes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resumes = await findAllResumes();
    res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    next(error);
  }
};

export const createResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = buildPayload(req.body);
    const resume = await createResumeDocument(payload);
    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

export const getResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid resume ID' });
    }

    const resume = await findResumeById(id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

export const updateResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid resume ID' });
    }

    const payload = buildPayload(req.body);
    const updatedResume = await updateResumeDocument(id, payload);

    if (!updatedResume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    res.status(200).json({ success: true, data: updatedResume });
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid resume ID' });
    }

    const deletedResume = await deleteResumeById(id);

    if (!deletedResume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    res.status(200).json({ success: true, data: deletedResume });
  } catch (error) {
    next(error);
  }
};
