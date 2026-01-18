import multer from 'multer';
import { Request } from 'express';

// File filter (images only)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed (JPEG, PNG, WebP).'));
    }
};

// Upload middleware with memory storage for Cloudinary
export const uploadGalleryPhoto = multer({
    storage: multer.memoryStorage(), // Changed from diskStorage to memoryStorage
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
}).single('photo'); // Field name must be 'photo'
