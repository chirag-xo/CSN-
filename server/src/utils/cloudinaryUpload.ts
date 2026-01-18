import cloudinary from '../config/cloudinary.config';
import { Readable } from 'stream';

export interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
}

/**
 * Upload file buffer to Cloudinary
 * @param buffer - File buffer from multer
 * @param folder - Cloudinary folder path (e.g., 'csn/profile_photos/userId')
 * @param options - Upload options
 * @returns Promise with secure_url and public_id
 */
export const uploadToCloudinary = (
    buffer: Buffer,
    folder: string,
    options: { overwrite?: boolean } = {}
): Promise<CloudinaryUploadResult> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                overwrite: options.overwrite || false,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                    });
                } else {
                    reject(new Error('Upload failed - no result returned'));
                }
            }
        );

        // Convert buffer to readable stream and pipe to Cloudinary
        Readable.from(buffer).pipe(uploadStream);
    });
};

/**
 * Delete file from Cloudinary
 * @param publicId - The public_id of the file to delete
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Failed to delete from Cloudinary:', error);
        throw error;
    }
};
