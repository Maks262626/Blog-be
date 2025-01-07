/// <reference path="../types/custom.d.ts" />

import { NextFunction, Request, Response } from 'express';

import admin from 'firebase-admin';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Cookies:', req.cookies);
  const idToken = req.cookies?.access_token;
  if (!idToken) {
    res.status(403).json({ error: 'No token provided' });
    return;
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.log(err);

    res.status(403).json({ error: 'Unauthorized' });
    return;
  }
}