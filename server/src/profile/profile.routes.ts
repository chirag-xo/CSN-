import { Router, Request, Response, NextFunction } from 'express';
import { profileService } from './profile.service';
import { authMiddleware } from '../auth/auth.middleware';
import { SuccessResponse } from '../shared/types';

const router = Router();

// All authenticated routes
router.use(authMiddleware);

// Get own profile
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profile = await profileService.getProfile(req.user!.userId, req.user!.userId);
        const response: SuccessResponse<typeof profile> = {
            success: true,
            data: profile,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Get detailed profile completion (new advanced version)
router.get('/completion', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { profileCompletionService } = await import('./profileCompletion.service');
        const completion = await profileCompletionService.calculate(req.user!.userId);
        const response: SuccessResponse<typeof completion> = {
            success: true,
            data: completion,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Get profile completion (legacy - just percentage)
router.get('/completion/percentage', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const completion = await profileService.getProfileCompletion(req.user!.userId);
        const response: SuccessResponse<{ completion: number }> = {
            success: true,
            data: { completion },
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Update own profile
router.put('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await profileService.updateProfile(req.user!.userId, req.body);
        const response: SuccessResponse<typeof updated> = {
            success: true,
            data: updated,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Get user profile (public with enhanced structure and viewer context)
// IMPORTANT: This must be last because /:userId is a catch-all
router.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const viewerId = req.user?.userId;
        const profile = await profileService.getPublicProfile(req.params.userId, viewerId);
        const response: SuccessResponse<typeof profile> = {
            success: true,
            data: profile,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

export default router;
