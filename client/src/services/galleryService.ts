import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('photo', file);
        if (caption) {
            formData.append('caption', caption);
        }

        const response = await axios.post(`${API_URL}/api/gallery`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get user's photos
    async getPhotos(limit: number = 12, offset: number = 0) {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/gallery`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit, offset },
        });
        return response.data;
    },

    // Get single photo
    async getPhoto(photoId: string) {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/gallery/${photoId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Delete photo
    async deletePhoto(photoId: string) {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/api/gallery/${photoId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Get gallery stats
    async getStats() {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/gallery/stats`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Toggle featured status
    async toggleFeatured(photoId: string) {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${API_URL}/api/gallery/${photoId}/feature`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Get featured photos
    async getFeaturedPhotos() {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/gallery/featured`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};

export default galleryService;
