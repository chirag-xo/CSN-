import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { SuccessResponse } from '../shared/types';
import { profilePhotoUpload, getProfilePhotoUrl, deleteProfilePhoto } from '../storage/localStorage';
import prisma from '../shared/database';
import { AppError } from '../shared/errors';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Upload profile photo
router.post(
    '/photo',
    profilePhotoUpload.single('photo'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                throw new AppError('No file uploaded', 400, 'NO_FILE');
            }

            const userId = req.user!.userId;

            // Get current user to delete old photo
            const currentUser = await prisma.user.findUnique({
                where: { id: userId },
                select: { profilePhoto: true },
            });

            // Delete old photo if exists
            if (currentUser?.profilePhoto) {
                try {
                    deleteProfilePhoto(currentUser.profilePhoto);
                } catch (err) {
                    console.error('Failed to delete old photo:', err);
                    // Continue anyway - not critical
                }
            }

            // Generate public URL
            const photoUrl = getProfilePhotoUrl(req.file.filename);

            // Update user profile
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { profilePhoto: photoUrl },
                select: {
                    id: true,
                    profilePhoto: true,
                },
            });

            const response: SuccessResponse<typeof updatedUser> = {
                success: true,
                data: updatedUser,
            };

            res.json(response);
        } catch (error) {
            next(error);
        }
    }
);

// Delete profile photo
router.delete('/photo', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { profilePhoto: true },
        });

        if (user?.profilePhoto) {
            // Delete file from disk
            try {
                deleteProfilePhoto(user.profilePhoto);
            } catch (err) {
                console.error('Failed to delete photo file:', err);
                // Continue anyway
            }

            // Remove from database
            await prisma.user.update({
                where: { id: userId },
                data: { profilePhoto: null },
            });
        }

        const response: SuccessResponse<{ success: boolean }> = {
            success: true,
            data: { success: true },
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
});

export default router;
