import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        error: 'Invalid or expired token',
      });
    }

    // Attach user to request
    req.user = {
      id: data.user.id,
      email: data.user.email,
    };

    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      error: 'Authentication failed',
      details: error.message,
    });
  }
};

// Optional middleware - doesn't require auth but attaches user if token is present
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data } = await supabase.auth.getUser(token);

      if (data.user) {
        req.user = {
          id: data.user.id,
          email: data.user.email,
        };
      }
    }

    next();
  } catch (error) {
    // Silently fail and continue without user
    next();
  }
};