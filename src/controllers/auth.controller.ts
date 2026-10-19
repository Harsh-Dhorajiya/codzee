import { Request, Response, NextFunction } from 'express';
import { authService, AuthService } from '../services/auth.service';
import { LoginInput, RegisterInput } from '../schemas/auth.schema';

export class AuthController {
  constructor(private readonly service: AuthService = authService) {}

  /**
   * POST /api/v1/auth/register
   * Create new user account.
   */
  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as RegisterInput;
      const result = await this.service.register(input);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/auth/login
   * Authenticate user credentials and return JWT.
   */
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as LoginInput;
      const result = await this.service.login(input);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();

