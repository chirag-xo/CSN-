import api from './api';

export interface GalleryPhoto {
    id: string;
    userId: string;
    url: string;
    caption?: string | null;
    isFeatured: boolean;
    featuredAt?: string | null;
    uploadedAt: string;
}

const galleryService = {
    // Upload photo
    async uploadPhoto(file: File, caption?: string) {
        const formData = new FormData();
        formData.append('photo', file);
        if (caption) {
            formData.append('caption', caption);
        }

        const response = await api.post('/gallery', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get user's photos
    async getPhotos(limit: number = 12, offset: number = 0) {
        const response = await api.get('/gallery', {
            params: { limit, offset },
        });
        return response.data;
    },

    // Get single photo
    async getPhoto(photoId: string) {
        const response = await api.get(`/gallery/${photoId}`);
        return response.data;
    },

    // Delete photo
    async deletePhoto(photoId: string) {
        const response = await api.delete(`/gallery/${photoId}`);
        return response.data;
    },

    // Get gallery stats
    async getStats() {
        const response = await api.get('/gallery/stats');
        return response.data;
    },

    // Toggle featured status
    async toggleFeatured(photoId: string) {
        const response = await api.patch(`/gallery/${photoId}/feature`);
        return response.data;
    },

    // Get featured photos
    async getFeaturedPhotos() {
        const response = await api.get('/gallery/featured');
        return response.data;
    },
};

export default galleryService;
