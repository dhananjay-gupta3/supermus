import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      error: Object.values(err.errors).map((error) => error.message).join('; ')
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format.',
      error: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred.',
    error: err instanceof Error ? err.message : 'Unknown error'
  });
};

export default errorHandler;
