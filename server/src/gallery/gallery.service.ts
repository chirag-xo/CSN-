import prisma from '../shared/database';
import { AppError, errorCodes } from '../shared/errors';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload';

export const galleryService = {
    // Upload photo
    async uploadPhoto(userId: string, fileBuffer: Buffer, photoId: string, caption?: string) {
        if (!fileBuffer) {
            throw new AppError('No file provided', 400, 'NO_FILE');
        }

        // Upload to Cloudinary
        const folder = `csn/gallery/${userId}/${photoId}`;
        const { secure_url, public_id } = await uploadToCloudinary(fileBuffer, folder);

        const photo = await prisma.galleryPhoto.create({
            data: {
                userId,
                url: secure_url,
                cloudinaryPublicId: public_id,
                caption: caption || null,
            },
        });

        return photo;
    },

    // Get user's photos (paginated)
    async getPhotos(userId: string, limit: number = 12, offset: number = 0) {
        const photos = await prisma.galleryPhoto.findMany({
            where: { userId },
            orderBy: { uploadedAt: 'desc' },
            take: limit,
            skip: offset,
        });

        const total = await prisma.galleryPhoto.count({
            where: { userId },
        });

        return {
            photos,
            total,
            hasMore: offset + photos.length < total,
        };
    },

    // Get photo by ID
    async getPhotoById(photoId: string) {
        const photo = await prisma.galleryPhoto.findUnique({
            where: { id: photoId },
        });

        if (!photo) {
            throw new AppError('Photo not found', 404, errorCodes.NOT_FOUND);
        }

        return photo;
    },

    // Delete photo
    async deletePhoto(photoId: string, userId: string) {
        const photo = await prisma.galleryPhoto.findUnique({
            where: { id: photoId },
        });

        if (!photo) {
            throw new AppError('Photo not found', 404, errorCodes.NOT_FOUND);
        }

        // Authorization check
        if (photo.userId !== userId) {
            throw new AppError('Not authorized to delete this photo', 403, errorCodes.UNAUTHORIZED);
        }

        // Delete from Cloudinary
        try {
            await deleteFromCloudinary(photo.cloudinaryPublicId);
        } catch (error) {
            console.error('Failed to delete from Cloudinary:', error);
            // Continue with database deletion even if Cloudinary deletion fails
        }

        // Delete from database
        await prisma.galleryPhoto.delete({
            where: { id: photoId },
        });

        return { message: 'Photo deleted successfully' };
    },

    // Get gallery stats
    async getStats(userId: string) {
        const totalPhotos = await prisma.galleryPhoto.count({
            where: { userId },
        });

        const photosWithCaptions = await prisma.galleryPhoto.count({
            where: {
                userId,
                caption: { not: null },
            },
        });

        const featuredPhotos = await prisma.galleryPhoto.count({
            where: {
                userId,
                isFeatured: true,
            },
        });

        // Calculate completion score
        let score = 0;
        if (totalPhotos > 0) score += 40; // Has photos
        if (totalPhotos >= 10) score += 20; // 10+ photos
        if (photosWithCaptions / Math.max(totalPhotos, 1) >= 0.5) score += 30; // 50%+ captioned
        if (featuredPhotos >= 3) score += 10; // Has featured photos

        return {
            totalPhotos,
            photosWithCaptions,
            featuredPhotos,
            completionScore: score,
        };
    },

    // Toggle featured status
    async toggleFeatured(photoId: string, userId: string) {
        const photo = await prisma.galleryPhoto.findUnique({
            where: { id: photoId },
        });

        if (!photo) {
            throw new AppError('Photo not found', 404, errorCodes.NOT_FOUND);
        }

        if (photo.userId !== userId) {
            throw new AppError('Not authorized', 403, errorCodes.UNAUTHORIZED);
        }

        // Check if user already has 6 featured photos
        if (!photo.isFeatured) {
            const featuredCount = await prisma.galleryPhoto.count({
                where: {
                    userId,
                    isFeatured: true,
                },
            });

            if (featuredCount >= 6) {
                throw new AppError('Maximum 6 photos can be featured', 400, 'MAX_FEATURED');
            }
        }

        const updated = await prisma.galleryPhoto.update({
            where: { id: photoId },
            data: {
                isFeatured: !photo.isFeatured,
                featuredAt: !photo.isFeatured ? new Date() : null,
            },
        });

        return updated;
    },

    // Get featured photos
    async getFeaturedPhotos(userId: string) {
        const photos = await prisma.galleryPhoto.findMany({
            where: {
                userId,
                isFeatured: true,
            },
            orderBy: { featuredAt: 'desc' },
            take: 6,
        });

        return photos;
    },
};
