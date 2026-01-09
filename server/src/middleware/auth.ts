import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import prisma from '../config/database';
import { AppError } from './errorHandler';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401);
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = authService.verifyToken(token);

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                company: true,
                position: true,
                city: true,
                bio: true,
                interests: true,
                createdAt: true
            }
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

// Export as 'authenticate' for convenience
export const authenticate = authMiddleware;
