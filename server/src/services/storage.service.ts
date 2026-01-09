import { Request } from 'express';

export interface StorageFile {
    url: string;
    filename: string;
}

export interface StorageService {
    uploadFile(file: Express.Multer.File, userId: string): Promise<StorageFile>;
    deleteFile(url: string): Promise<void>;
}

export class LocalStorageService implements StorageService {
    private uploadDir = 'uploads';
    private baseUrl = process.env.SERVER_URL || 'http://localhost:3001';

    async uploadFile(file: Express.Multer.File, userId: string): Promise<StorageFile> {
        // File is already saved by multer to uploads directory
        // Return the URL
        const url = `${this.baseUrl}/${this.uploadDir}/${file.filename}`;

        return {
            url,
            filename: file.filename
        };
    }

    async deleteFile(url: string): Promise<void> {
        // Extract filename from URL
        const filename = url.split('/').pop();
        if (!filename) return;

        const fs = await import('fs/promises');
        const path = await import('path');

        try {
            await fs.unlink(path.join(this.uploadDir, filename));
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    }
}

// Factory function to get the appropriate storage service
export function getStorageService(): StorageService {
    // For now, always return LocalStorageService
    // In production, check environment variable:
    // if (process.env.STORAGE_PROVIDER === 's3') return new S3StorageService();
    return new LocalStorageService();
}
