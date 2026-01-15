import { Router, Request, Response, NextFunction } from 'express';
import { galleryService } from './gallery.service';
import { authMiddleware } from '../auth/auth.middleware';
import { uploadGalleryPhoto } from '../middleware/upload';
import { SuccessResponse } from '../shared/types';

const router = Router();

// All gallery routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/gallery
 * @desc    Upload a photo to gallery
 * @access  Private
 */
router.post('/', uploadGalleryPhoto, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { caption } = req.body;
        const file = req.file;

        const photo = await galleryService.uploadPhoto(req.user!.userId, file!, caption);

        const response: SuccessResponse<typeof photo> = {
            success: true,
            data: photo,
        };

        res.status(201).json(response);
    } catch (error) {
        // Clean up uploaded file if error occurs
        if (req.file) {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(process.cwd(), 'uploads/gallery', req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        next(error);
    }
});

/**
 * @route   GET /api/gallery
 * @desc    Get user's gallery photos
 * @access  Private
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = parseInt(req.query.limit as string) || 12;
        const offset = parseInt(req.query.offset as string) || 0;

        const result = await galleryService.getPhotos(req.user!.userId, limit, offset);

        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/gallery/stats
 * @desc    Get gallery statistics
 * @access  Private
 */
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await galleryService.getStats(req.user!.userId);

        const response: SuccessResponse<typeof stats> = {
            success: true,
            data: stats,
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/gallery/:id
 * @desc    Get single photo details
 * @access  Private
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const photo = await galleryService.getPhotoById(req.params.id);

        const response: SuccessResponse<typeof photo> = {
            success: true,
            data: photo,
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

/**
 * @route   DELETE /api/gallery/:id
 * @desc    Delete a photo from gallery
 * @access  Private
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await galleryService.deletePhoto(req.params.id, req.user!.userId);

        const response: SuccessResponse<typeof result> = {
            success: true,
            data: result,
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

/**
 * @route   PATCH /api/gallery/:id/feature
 * @desc    Toggle featured status of a photo
 * @access  Private
 */
router.patch('/:id/feature', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const photo = await galleryService.toggleFeatured(req.params.id, req.user!.userId);

        const response: SuccessResponse<typeof photo> = {
            success: true,
            data: photo,
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

/**
 * @route   GET /api/gallery/featured
 * @desc    Get featured photos
 * @access  Private
 */
router.get('/featured', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const photos = await galleryService.getFeaturedPhotos(req.user!.userId);

        const response: SuccessResponse<typeof photos> = {
            success: true,
            data: photos,
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

export default router;
