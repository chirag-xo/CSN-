import { Router, Request, Response } from 'express';
import { chapterService } from './chapter.service';
import { SuccessResponse } from '../shared/types';

const router = Router();

/**
 * @route   GET /api/public/chapters
 * @desc    Get all chapters with optional filtering
 * @access  Public
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const { cityId, stateId, state } = req.query;

        const filters = {
            cityId: cityId as string | undefined,
            stateId: stateId as string | undefined,
            state: state as string | undefined,
        };

        const chapters = await chapterService.getPublicChapters(filters);

        const response: SuccessResponse<typeof chapters> = {
            success: true,
            data: chapters,
        };

        // Cache for 5 minutes
        res.setHeader('Cache-Control', 'public, max-age=300');
        res.json(response);
    } catch (error) {
        console.error('Error fetching chapters:', error);
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch chapters' },
        });
    }
});

export default router;
