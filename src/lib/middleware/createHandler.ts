import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter, expressWrapper } from 'next-connect';
import { connectDB } from '../db/mongoose';
import express from 'express';

// Express middleware
const jsonParser = express.json();
const urlEncodedParser = express.urlencoded({ extended: true });

export function createHandler() {
  const router = createRouter<NextApiRequest, NextApiResponse>();

  router
    .use(expressWrapper(jsonParser))
    .use(expressWrapper(urlEncodedParser))
    .use(async (req, res, next) => {
      try {
        await connectDB();
        // @ts-ignore - next-connect types are not fully compatible with express
        next();
      } catch (error) {
        // Handle database connection errors
        res.status(500).json({ error: 'Database connection failed' });
      }
    });

  return router;
}
