import { Router, Request, Response, NextFunction } from 'express';
import { profileService } from './profile.service';
import { authMiddleware } from '../auth/auth.middleware';
import { optionalAuthMiddleware } from '../middleware/optionalAuth';
import { SuccessResponse } from '../shared/types';

const router = Router();

// ============================================================================
// PRIVATE ROUTES (Require Authentication)
// ============================================================================

// Get detailed profile completion
// MUST be defined before /:userId to avoid collision
router.get('/completion', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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
router.get('/completion/percentage', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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

// Get own profile
router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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

// Update own profile
router.put('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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

// ============================================================================
// PUBLIC ROUTES (Optional Authentication)
// ============================================================================

// Get user profile (public with enhanced structure and viewer context)
// IMPORTANT: This uses optionalAuthMiddleware to allow guests to view public info
router.get('/:userId', optionalAuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        // req.user will be defined if token is valid, undefined otherwise
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
