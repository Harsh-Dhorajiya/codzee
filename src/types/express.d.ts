import { AuthUserPayload } from './user.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

