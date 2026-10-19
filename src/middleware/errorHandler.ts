import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app.error';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isDev = process.env.NODE_ENV === 'development';

  // 1. Handle JSON syntax errors from body-parser
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Malformed JSON payload in request body',
      ...(isDev && { stack: err.stack }),
    });
    return;
  }

  // 2. Handle Custom Operational Application Errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      ...(err.errors && err.errors.length > 0 && { errors: err.errors }),
      ...(isDev && { stack: err.stack }),
    });
    return;
  }

  // 3. Handle Unexpected System / Uncaught Errors
  console.error('[Unhandled Error Intercepted]:', err);

  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const message = isDev && err.message ? err.message : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(isDev && { stack: err.stack }),
  });
};

