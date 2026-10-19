import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { loginRateLimiter } from '../middleware/rateLimiter';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', validate(registerSchema, 'body'), authController.register);
router.post('/login', loginRateLimiter, validate(loginSchema, 'body'), authController.login);

export default router;

