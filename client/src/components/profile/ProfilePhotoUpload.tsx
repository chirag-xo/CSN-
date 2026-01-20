import { useState, useRef } from 'react';
import api from '../../services/api';

interface ProfilePhotoUploadProps {
    currentPhoto: string | null;
    onPhotoUpdate: (photoUrl: string) => void;
    userInitials: string;
}

export default function ProfilePhotoUpload({
    currentPhoto,
    onPhotoUpdate,
    userInitials,
}: ProfilePhotoUploadProps) {
    // Convert relative URL to full URL if needed
    const getFullPhotoUrl = (url: string | null): string | null => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${url}`;
    };

    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(getFullPhotoUrl(currentPhoto));
    const [error, setError] = useState<string>('');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (file.size > maxSize) {
            return 'File size must be less than 5MB';
        }

        if (!allowedTypes.includes(file.type)) {
            return 'Only JPG, PNG, and WebP images are allowed';
        }

        return null;
    };

    const handleFileChange = async (file: File) => {
        setError('');

        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        await uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        try {
            setUploading(true);
            setError('');

            const formData = new FormData();
            formData.append('photo', file);

            const response = await api.post('/profile/photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const photoUrl = response.data.data.profilePhoto;

            // Construct full URL if it's a relative path
            const fullPhotoUrl = photoUrl.startsWith('http')
                ? photoUrl
                : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${photoUrl}`;

            onPhotoUpdate(fullPhotoUrl);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.response?.data?.error?.message || 'Failed to upload photo');
            setPreview(getFullPhotoUrl(currentPhoto));
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileChange(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileChange(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDelete = async () => {
        if (!window.confirm('Remove profile photo?')) return;

        try {
            setUploading(true);
            await api.delete('/profile/photo');
            setPreview(null);
            onPhotoUpdate('');
        } catch (err: any) {
            console.error('Delete error:', err);
            setError('Failed to delete photo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="profile-photo-section">
            <div
                className={`photo-dropzone ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Profile"
                        className="photo-preview-img"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${userInitials}&background=6D28D9&color=fff`;
                        }}
                    />
                ) : (
                    <div className="photo-placeholder-large">{userInitials}</div>
                )}

                {uploading && (
                    <div className="upload-overlay">
                        <div className="upload-spinner"></div>
                    </div>
                )}

                {!uploading && (
                    <div className="upload-hint">
                        <span>Click to upload</span>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleInputChange}
                style={{ display: 'none' }}
            />

            <div className="photo-info">
                <div className="photo-actions-btns">
                    <button
                        type="button"
                        onClick={handleClick}
                        disabled={uploading}
                        className="upload-action-btn primary"
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                    {preview && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={uploading}
                            className="upload-action-btn secondary"
                        >
                            Remove
                        </button>
                    )}
                </div>

                {error ? (
                    <p className="upload-error">{error}</p>
                ) : (
                    <p className="upload-info">JPG, PNG or WebP. Max 5MB</p>
                )}
            </div>
        </div>
    );
}
