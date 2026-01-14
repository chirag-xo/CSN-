import { Router, Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';
import { authMiddleware } from '../auth/auth.middleware';
import { SuccessResponse } from '../shared/types';

const router = Router();

// All dashboard routes require authentication
router.use(authMiddleware);

// Get dashboard summary
router.get('/summary', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const summary = await dashboardService.getSummary(req.user!.userId);
        const response: SuccessResponse<typeof summary> = {
            success: true,
            data: summary,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

export default router;
