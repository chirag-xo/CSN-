import { Router, Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { authMiddleware } from './auth.middleware';
import { SuccessResponse } from '../shared/types';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Register
router.post('/register', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.register(req.body);
        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
        };
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
});

// Login
router.post('/login', authLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.login(req.body);
        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Get current user (protected)
router.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authService.getCurrentUser(req.user!.userId);
        const response: SuccessResponse<typeof user> = {
            success: true,
            data: user,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

export default router;
