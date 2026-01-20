import { Router, Request, Response } from 'express';
import { chapterService } from './chapter.service';
import { SuccessResponse } from '../shared/types';

const router = Router();

/**
 * @route   GET /api/chapters
 * @desc    Get all chapters
 * @access  Public
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const chapters = await chapterService.getAllChapters();

        const response: SuccessResponse<typeof chapters> = {
            success: true,
            data: chapters,
        };

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
