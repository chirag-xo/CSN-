import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/quicktime'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Max number of files
const MAX_FILES = 5;

// Configure storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req: Request & { user?: any }, file, cb) => {
        const userId = req.user?.id || 'unknown';
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const ext = path.extname(file.originalname);
        const filename = `${userId}-${timestamp}-${random}${ext}`;
        cb(null, filename);
    }
});

// File filter
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed types: ${ALLOWED_TYPES.join(', ')}`));
    }
};

// Create multer instance
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: MAX_FILES
    }
});

// Helper to determine media type
export function getMediaType(mimetype: string): 'IMAGE' | 'VIDEO' {
    if (ALLOWED_IMAGE_TYPES.includes(mimetype)) return 'IMAGE';
    if (ALLOWED_VIDEO_TYPES.includes(mimetype)) return 'VIDEO';
    throw new Error(`Unsupported media type: ${mimetype}`);
}
