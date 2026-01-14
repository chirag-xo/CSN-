import { Router, Request, Response, NextFunction } from 'express';
import { referralService } from './referral.service';
import { authMiddleware } from '../auth/auth.middleware';
import { SuccessResponse } from '../shared/types';

const router = Router();

// All referral routes require authentication
router.use(authMiddleware);

// Get referrals given by user
router.get('/given', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const referrals = await referralService.getReferralsGiven(req.user!.userId);
        const response: SuccessResponse<typeof referrals> = {
            success: true,
            data: referrals,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Get referrals received by user
router.get('/received', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const referrals = await referralService.getReferralsReceived(req.user!.userId);
        const response: SuccessResponse<typeof referrals> = {
            success: true,
            data: referrals,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

// Create referral
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const referral = await referralService.createReferral(req.user!.userId, req.body);
        const response: SuccessResponse<typeof referral> = {
            success: true,
            data: referral,
        };
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
});

// Update referral status
router.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const referral = await referralService.updateReferralStatus(
            req.params.id,
            req.user!.userId,
            req.body
        );
        const response: SuccessResponse<typeof referral> = {
            success: true,
            data: referral,
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});

export default router;
