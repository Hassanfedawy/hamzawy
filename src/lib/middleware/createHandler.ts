import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter, expressWrapper } from 'next-connect';
import { connectDB } from '../db/mongoose';
import { errorHandler } from './error';
import express from 'express';

// Express middleware
const jsonParser = express.json();
const urlEncodedParser = express.urlencoded({ extended: true });

export function createHandler() {
  return createRouter<NextApiRequest, NextApiResponse>()
    .use(expressWrapper(jsonParser))
    .use(expressWrapper(urlEncodedParser))
    .use(async (req, res, next) => {
      try {
        await connectDB();
        next();
      } catch (error) {
        next(error);
      }
    })
    .onError(errorHandler);
}
