import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ConflictError, UnauthorizedError } from '../errors/app.error';
import { getJwtConfig } from '../config/jwt.config';
import {
  AuthResponse,
  AuthUserPayload,
  LoginDTO,
  RegisterDTO,
  SafeUser,
  User,
} from '../types/user.types';

// Precomputed bcrypt hash used to equalize execution timing when email does not exist
const TIMING_SAFE_DUMMY_HASH = '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6FeE2V2b8q1w3rT9e';

export class AuthService {
  private users: Map<string, User> = new Map();

  /**
   * Register a new user and generate access token.
   */
  public async register(dto: RegisterDTO): Promise<AuthResponse> {
    const normalizedEmail = dto.email.toLowerCase().trim();

    // Check email uniqueness
    const existing = this.findByEmail(normalizedEmail);
    if (existing) {
      throw new ConflictError('User with this email is already registered');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const newUser: User = {
      id: uuidv4(),
      email: normalizedEmail,
      name: dto.name.trim(),
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    this.users.set(newUser.id, newUser);

    const safeUser = this.sanitizeUser(newUser);
    const token = this.generateToken({ id: newUser.id, email: newUser.email });

    return {
      user: safeUser,
      token,
    };
  }

  /**
   * Authenticate user credentials and return access token.
   * Employs timing equalization and generic error messages to eliminate account enumeration.
   */
  public async login(dto: LoginDTO): Promise<AuthResponse> {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const user = this.findByEmail(normalizedEmail);

    // If user is absent, compare against dummy hash to prevent timing-based user enumeration
    const targetHash = user ? user.passwordHash : TIMING_SAFE_DUMMY_HASH;
    const isPasswordValid = await bcrypt.compare(dto.password, targetHash);

    if (!user || !isPasswordValid) {
      // Intentionally uniform error message to prevent account existence leakage
      throw new UnauthorizedError('Invalid credentials');
    }

    const safeUser = this.sanitizeUser(user);
    const token = this.generateToken({ id: user.id, email: user.email });

    return {
      user: safeUser,
      token,
    };
  }

  /**
   * Locate user by ID.
   */
  public findById(id: string): User | null {
    const user = this.users.get(id);
    return user ? { ...user } : null;
  }

  /**
   * Locate user by email (case-insensitive).
   */
  public findByEmail(email: string): User | null {
    const normalized = email.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email === normalized) {
        return { ...user };
      }
    }
    return null;
  }

  /**
   * Strips sensitive properties such as passwordHash before returning to clients.
   */
  private sanitizeUser(user: User): SafeUser {
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Sign a JSON Web Token with the user payload.
   */
  private generateToken(payload: AuthUserPayload): string {
    const { secret, expiresIn } = getJwtConfig();
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  }
}

export const authService = new AuthService();

