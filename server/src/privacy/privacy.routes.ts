import { Router, Request, Response, NextFunction } from 'express';
import { privacyService } from './privacy.service';
import { authMiddleware } from '../auth/auth.middleware';
import { SuccessResponse } from '../shared/types';

const router = Router();

// All privacy routes require authentication
router.use(authMiddleware);

// Get privacy settings
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const privacy = await privacyService.getPrivacySettings(req.user!.userId);
        const response: SuccessResponse<typeof privacy> = {
            success: true,
            data: privacy,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Update privacy settings
router.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const privacy = await privacyService.updatePrivacySettings(req.user!.userId, req.body);
        const response: SuccessResponse<typeof privacy> = {
            success: true,
            data: privacy,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

export default router;
