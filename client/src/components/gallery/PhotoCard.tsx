import { useState } from 'react';
import { type GalleryPhoto } from '../../services/galleryService';
import '../../styles/gallery.css';

interface PhotoCardProps {
    photo: GalleryPhoto;
    onDelete: (id: string) => void;
    onToggleFeatured: (id: string) => void;
}

export default function PhotoCard({ photo, onDelete, onToggleFeatured }: PhotoCardProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const imageUrl = `${API_URL}${photo.url}`;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleDelete = () => {
        onDelete(photo.id);
        setShowConfirm(false);
    };

    return (
        <>
            <div className="photo-card">
                <div className="photo-wrapper">
                    <img src={imageUrl} alt={photo.caption || 'Gallery photo'} />
                    {photo.isFeatured && <div className="featured-badge">⭐ Featured</div>}
                    <div className="photo-overlay">
                        <button className="feature-btn" onClick={() => onToggleFeatured(photo.id)}>
                            {photo.isFeatured ? '⭐ Unfeature' : '⭐ Feature'}
                        </button>
                        <button className="delete-btn" onClick={() => setShowConfirm(true)}>
                            🗑️ Delete
                        </button>
                    </div>
                </div>
                {photo.caption && <p className="photo-caption">{photo.caption}</p>}
                <p className="photo-date">📅 {formatDate(photo.uploadedAt)}</p>
            </div>

            {showConfirm && (
                <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete Photo</h3>
                            <button className="modal-close" onClick={() => setShowConfirm(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this photo? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
                            <button className="btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
