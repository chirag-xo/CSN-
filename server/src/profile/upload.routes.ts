import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../auth/auth.middleware';
import { SuccessResponse } from '../shared/types';
import { profilePhotoUpload, saveProfilePhoto, deleteProfilePhoto } from '../storage/mediaStorage';
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
            if (!req.file || !req.file.buffer) {
                throw new AppError('No file uploaded', 400, 'NO_FILE');
            }

            const userId = req.user!.userId;

            // Upload to Cloudinary (this also deletes old photo)
            const { url, publicId } = await saveProfilePhoto(userId, req.file.buffer);

            // Update user profile with Cloudinary URL and public_id
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    profilePhoto: url,
                    profilePhotoPublicId: publicId,
                },
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
            select: { profilePhotoPublicId: true },
        });

        if (user?.profilePhotoPublicId) {
            // Delete from Cloudinary
            try {
                await deleteProfilePhoto(user.profilePhotoPublicId);
            } catch (err) {
                console.error('Failed to delete photo from Cloudinary:', err);
                // Continue anyway
            }

            // Remove from database
            await prisma.user.update({
                where: { id: userId },
                data: {
                    profilePhoto: null,
                    profilePhotoPublicId: null,
                },
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
