import { Router, Request, Response, NextFunction } from 'express';
import { interestService } from './interest.service';
import { authMiddleware } from '../auth/auth.middleware';
import { SuccessResponse } from '../shared/types';

const router = Router();

// Get all available interests (public endpoint)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const interests = await interestService.getAllInterests();
        const response: SuccessResponse<typeof interests> = {
            success: true,
            data: interests,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

// All other routes require authentication
router.use(authMiddleware);

// Get current user's interests
router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const interests = await interestService.getUserInterests(req.user!.userId);
        const response: SuccessResponse<typeof interests> = {
            success: true,
            data: interests,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Add interest
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await interestService.addInterest(req.user!.userId, req.body);
        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
        };
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
});

// Remove interest
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await interestService.removeInterest(req.user!.userId, req.params.id);
        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Update interest visibility
router.patch('/:id/visibility', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await interestService.updateVisibility(
            req.user!.userId,
            req.params.id,
            req.body.visibility
        );
        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

export default router;
