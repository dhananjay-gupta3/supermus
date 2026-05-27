import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import resumeRoutes from './routes/resumeRoutes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', resumeRoutes);
app.use(errorHandler);

export default app;
