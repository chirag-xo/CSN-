import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        userId: string;
        email: string;
    };
}

/**
 * Optional authentication middleware
 * Extracts user info from JWT if present, but doesn't require it
 * Useful for routes that behave differently when authenticated but are still public
 */
export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        // No auth provided, continue without user info
        return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        // Invalid format, continue without user info
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
        req.user = {
            id: decoded.userId,
            userId: decoded.userId,
            email: decoded.email
        };
        next();
    } catch (error) {
        // Invalid token, continue without user info
        next();
    }
}
