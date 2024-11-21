import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

interface ValidationError {
  message: string;
  kind: string;
  path: string;
  value: any;
}

export interface ApiError extends Error {
  statusCode?: number;
  errors?: { [key: string]: ValidationError };
  code?: number;
}

export function errorHandler(
  err: ApiError,
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  console.error(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors: { [key: string]: string[] } = {};
    Object.entries(err.errors || {}).forEach(([key, error]) => {
      if (error && typeof error === 'object' && 'message' in error) {
        errors[key] = [error.message as string];
      }
    });
    return res.status(400).json({
      error: 'Validation Error',
      errors,
    });
  }

  // MongoDB duplicate key error
  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate Error',
      message: 'A record with this information already exists',
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
