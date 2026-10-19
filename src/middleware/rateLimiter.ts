import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Rate limiter for authentication login endpoint to mitigate brute-force attacks.
 * Limits each IP to 5 requests per 15 minutes window.
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Limit each IP to 5 login attempts per window
  standardHeaders: true, // Draft-6/7 RateLimit-* headers
  legacyHeaders: false, // X-RateLimit-* headers disabled
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      statusCode: 429,
      message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
    });
  },
});

