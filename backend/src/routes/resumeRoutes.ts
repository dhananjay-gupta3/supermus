import { Router } from 'express';
import {
  createResume,
  deleteResume,
  getAllResumes,
  getResume,
  updateResume
} from '../controllers/resumeController';

const router = Router();

router.get('/resume', getAllResumes);
router.post('/resume', createResume);
router.get('/resume/:id', getResume);
router.put('/resume/:id', updateResume);
router.delete('/resume/:id', deleteResume);

export default router;
