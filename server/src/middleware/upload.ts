import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Ensure upload directory exists
const uploadDir = 'uploads/gallery/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, 'uploads/gallery/');
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const userId = (req as any).user?.userId || 'unknown';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const sanitizedName = file.originalname.replace(ext, '').replace(/[^a-z0-9]/gi, '_');
        cb(null, `${userId}-${timestamp}-${sanitizedName}${ext}`);
    },
});

// File filter (images only)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed (JPEG, PNG, GIF, WebP).'));
    }
};

// Upload middleware
export const uploadGalleryPhoto = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
}).single('photo'); // Field name must be 'photo'
