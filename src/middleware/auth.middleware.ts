import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/app.error';
import { getJwtConfig } from '../config/jwt.config';
import { AuthUserPayload } from '../types/user.types';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or malformed Authorization header. Expected format: Bearer <token>');
  }

  const token = authHeader.split(' ')[1];

  try {
    const { secret } = getJwtConfig();
    const decoded = jwt.verify(token, secret) as AuthUserPayload;

    if (!decoded || !decoded.id || !decoded.email) {
      throw new UnauthorizedError('Malformed token payload');
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Authentication token has expired'));
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid authentication token'));
      return;
    }
    next(error);
  }
};

