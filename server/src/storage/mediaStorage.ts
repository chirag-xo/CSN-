import multer from 'multer';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload';
import prisma from '../shared/database';

// File filter for image validation
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PNG, JPEG, and WebP are allowed.'));
    }
};

// Create multer instance with memory storage and validation
export const profilePhotoUpload = multer({
    storage: multer.memoryStorage(), // Changed from diskStorage to memoryStorage
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
});

/**
 * Save profile photo to Cloudinary
 * Deletes old photo if it exists before uploading new one
 * @param userId - User ID for folder organization
 * @param buffer - File buffer from multer
 * @returns Object with url and publicId
 */
export const saveProfilePhoto = async (
    userId: string,
    buffer: Buffer
): Promise<{ url: string; publicId: string }> => {
    // Get user's current profile photo public_id to delete old one
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { profilePhotoPublicId: true },
    });

    // Delete old profile photo from Cloudinary if exists
    if (user?.profilePhotoPublicId) {
        try {
            await deleteFromCloudinary(user.profilePhotoPublicId);
        } catch (error) {
            console.error('Failed to delete old profile photo:', error);
            // Continue with upload even if deletion fails
        }
    }

    // Upload new photo to Cloudinary
    const folder = `csn/profile_photos/${userId}`;
    const result = await uploadToCloudinary(buffer, folder, { overwrite: true });

    return {
        url: result.secure_url,
        publicId: result.public_id,
    };
};

/**
 * Delete profile photo from Cloudinary
 * @param publicId - Cloudinary public_id
 */
export const deleteProfilePhoto = async (publicId: string): Promise<void> => {
    if (!publicId) return;
    await deleteFromCloudinary(publicId);
};
