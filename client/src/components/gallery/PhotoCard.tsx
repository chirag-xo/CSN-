import { useState } from 'react';
import { type GalleryPhoto } from '../../services/galleryService';
import { Eye, Trash2, Download, Star } from 'lucide-react';
import '../../styles/gallery.css';

interface PhotoCardProps {
    photo: GalleryPhoto;
    onDelete: (id: string) => void;
    onToggleFeatured: (id: string) => void;
}

export default function PhotoCard({ photo, onDelete, onToggleFeatured }: PhotoCardProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    // If URL already starts with http/https (Cloudinary URL), use it as-is
    // Otherwise, prepend API_URL for legacy local storage URLs
    const imageUrl = photo.url.startsWith('http') ? photo.url : `${API_URL}${photo.url}`;

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

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `photo-${photo.id}.jpg`;
        link.click();
    };

    return (
        <>
            <div className="photo-card">
                <div className="photo-wrapper">
                    <img src={imageUrl} alt={photo.caption || 'Gallery photo'} loading="lazy" />
                    {photo.isFeatured && (
                        <div className="featured-badge">
                            <Star size={14} fill="white" /> Featured
                        </div>
                    )}
                    <div className="photo-overlay">
                        <button className="view-btn" onClick={() => setShowPreview(true)}>
                            <Eye size={16} />
                            View
                        </button>
                        <button className="feature-btn" onClick={() => onToggleFeatured(photo.id)}>
                            <Star size={16} />
                            {photo.isFeatured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button className="download-btn" onClick={handleDownload}>
                            <Download size={16} />
                            Download
                        </button>
                        <button className="delete-btn" onClick={() => setShowConfirm(true)}>
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </div>
                </div>
                <div className="photo-footer">
                    {photo.caption && <p className="photo-caption">{photo.caption}</p>}
                    <span className="photo-date">
                        📅 {formatDate(photo.uploadedAt)}
                    </span>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
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

            {/* Preview Modal */}
            {showPreview && (
                <div className="modal-overlay" onClick={() => setShowPreview(false)}>
                    <div className="modal-content" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Photo Preview</h3>
                            <button className="modal-close" onClick={() => setShowPreview(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <img src={imageUrl} alt={photo.caption || 'Gallery photo'} style={{ width: '100%', borderRadius: '12px' }} />
                            {photo.caption && <p style={{ marginTop: '16px', fontSize: '14px', color: '#4B5563' }}>{photo.caption}</p>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
