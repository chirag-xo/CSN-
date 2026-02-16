import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { AppError, errorCodes } from '../shared/errors';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        // Check if user is already authenticated (e.g. by Clerk)
        if (req.user) {
            return next();
        }

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401, errorCodes.UNAUTHORIZED);
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = authService.verifyToken(token);

        // Attach user info to request
        req.user = {
            id: decoded.userId,
            userId: decoded.userId,
            email: decoded.email,
        };

        next();
    } catch (error) {
        next(error);
    }
};
