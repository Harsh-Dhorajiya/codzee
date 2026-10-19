import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError, FieldError } from '../errors/app.error';

type RequestLocation = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, location: RequestLocation = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[location]);
      // Mutate req[location] with stripped/coerced data
      req[location] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: FieldError[] = error.errors.map((err) => ({
          field: err.path.length > 0 ? err.path.join('.') : location,
          message: err.message,
        }));
        return next(new ValidationError('Validation failed', fieldErrors));
      }
      next(error);
    }
  };
};

