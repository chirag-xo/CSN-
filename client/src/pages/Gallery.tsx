import { useState, useEffect } from 'react';
import galleryService, { type GalleryPhoto } from '../services/galleryService';
import Breadcrumb from '../components/common/Breadcrumb';
import PhotoUpload from '../components/gallery/PhotoUpload';
import PhotoCard from '../components/gallery/PhotoCard';
import { Camera, Plus, AlertTriangle, Image as ImageIcon, Loader2 } from 'lucide-react';
import '../styles/gallery.css';

export default function Gallery() {
    const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [stats, setStats] = useState({ totalPhotos: 0, photosWithCaptions: 0, featuredPhotos: 0, completionScore: 0 });
    const LIMIT = 12;

    useEffect(() => {
        fetchPhotos(true);
        fetchStats();
    }, []);

    const fetchPhotos = async (reset: boolean = false) => {
        try {
            setLoading(true);
            setError('');
            const currentOffset = reset ? 0 : offset;

            const response = await galleryService.getPhotos(LIMIT, currentOffset);

            if (reset) {
                setPhotos(response.data.photos || []);
                setOffset(0);
            } else {
                setPhotos([...photos, ...(response.data.photos || [])]);
            }

            setHasMore(response.data.hasMore);
        } catch (err: any) {
            console.error('Failed to fetch photos:', err);
            setError(err.response?.data?.error?.message || 'Failed to load photos');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await galleryService.getStats();
            setStats(response.data);
        } catch (err: any) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const loadMore = () => {
        const newOffset = offset + LIMIT;
        setOffset(newOffset);
        fetchPhotos(false);
    };

    const handleUploadSuccess = (photo: GalleryPhoto) => {
        setPhotos([photo, ...photos]);
        setShowUpload(false);
    };

    const handleDelete = async (photoId: string) => {
        try {
            await galleryService.deletePhoto(photoId);
            setPhotos(photos.filter((p) => p.id !== photoId));
            fetchStats(); // Refresh stats
        } catch (err: any) {
            console.error('Failed to delete photo:', err);
            alert('Failed to delete photo. Please try again.');
        }
    };

    const handleToggleFeatured = async (photoId: string) => {
        try {
            const response = await galleryService.toggleFeatured(photoId);
            setPhotos(photos.map(p => p.id === photoId ? response.data : p));
            fetchStats(); // Refresh stats
        } catch (err: any) {
            console.error('Failed to toggle featured:', err);
            alert(err.response?.data?.error?.message || 'Failed to update featured status');
        }
    };

    const breadcrumbItems = [
        { label: 'Dashboard', path: '/dashboard/home' },
        { label: 'Gallery', path: '/dashboard/home/gallery' },
    ];

    return (
        <div className="gallery-page">
            <Breadcrumb items={breadcrumbItems} />

            <div className="page-header">
                <div className="header-title">
                    <div className="icon-wrapper">
                        <Camera size={24} />
                    </div>
                    <h1>My Gallery</h1>
                </div>
                <button className="btn-primary" onClick={() => setShowUpload(true)}>
                    <Plus size={20} /> Upload Photo
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="error-state">
                    <div className="error-icon">
                        <AlertTriangle size={48} />
                    </div>
                    <p>{error}</p>
                    <button onClick={() => fetchPhotos(true)}>Retry</button>
                </div>
            )}

            {/* Loading State */}
            {loading && offset === 0 && (
                <div className="loading-state">
                    <Loader2 size={48} className="animate-spin text-purple-600 mx-auto mb-4" />
                    <p>Loading photos...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && photos.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">
                        <ImageIcon size={64} strokeWidth={1} />
                    </div>
                    <h3>No photos yet</h3>
                    <p>Upload your first photo to get started!</p>
                    <button className="btn-primary" onClick={() => setShowUpload(true)}>
                        <Plus size={20} /> Upload Photo
                    </button>
                </div>
            )}

            {/* Photo Grid */}
            {!loading && !error && photos.length > 0 && (
                <div className="photos-container">
                    <div className="photo-grid">
                        {photos.map((photo) => (
                            <PhotoCard
                                key={photo.id}
                                photo={photo}
                                onDelete={handleDelete}
                                onToggleFeatured={handleToggleFeatured}
                            />
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                        <button className="load-more-btn" onClick={loadMore} disabled={loading}>
                            {loading ? 'Loading...' : 'Load More'}
                        </button>
                    )}
                </div>
            )}

            {/* Upload Modal */}
            <PhotoUpload
                isOpen={showUpload}
                onClose={() => setShowUpload(false)}
                onSuccess={handleUploadSuccess}
            />
        </div>
    );
}
