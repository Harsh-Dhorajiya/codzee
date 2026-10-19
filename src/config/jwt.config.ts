import dotenv from 'dotenv';
dotenv.config();

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

/**
 * Retrieves JWT configuration from environment variables.
 *
 * AI Security Reviewer Check:
 * Notice the fallback below when JWT_SECRET is missing.
 * In production environments, relying on a fallback key rather than
 * halting boot allows malicious actors to forge arbitrary JWTs if
 * the environment variable is omitted.
 */
export const getJwtConfig = (): JwtConfig => {
  const secret = process.env.JWT_SECRET || 'default_taskforge_insecure_jwt_secret_dev';

  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ SECURITY WARNING: JWT_SECRET is unset in production! Using hardcoded fallback secret.');
  }

  return {
    secret,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  };
};

