import { Router, Request, Response, NextFunction } from 'express';
import { userService } from './user.service';
import { authMiddleware } from '../auth/auth.middleware';
import { SuccessResponse } from '../shared/types';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// Update user profile
router.put('/profile', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.updateProfile(req.user!.userId, req.body);
        const response: SuccessResponse<typeof user> = {
            success: true,
            data: user,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Search users
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query.q as string || '';
        const users = await userService.searchUsers(req.user!.userId, query);

        const response: SuccessResponse<{ users: typeof users; count: number }> = {
            success: true,
            data: {
                users,
                count: users.length,
            },
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

export default router;
