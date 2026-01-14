import { useState } from 'react';
import galleryService, { type GalleryPhoto } from '../../services/galleryService';
import '../../styles/gallery.css';

interface PhotoUploadProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (photo: GalleryPhoto) => void;
}

export default function PhotoUpload({ isOpen, onClose, onSuccess }: PhotoUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);

    const handleFileSelect = (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setError('');
        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file');
            return;
        }

        try {
            setUploading(true);
            setError('');
            const response = await galleryService.uploadPhoto(selectedFile, caption);
            onSuccess(response.data);
            handleClose();
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.response?.data?.error?.message || 'Failed to upload photo');
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreview('');
        setCaption('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content upload-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>📸 Upload Photo</h3>
                    <button className="modal-close" onClick={handleClose}>✕</button>
                </div>

                <div className="modal-body">
                    {error && <div className="error-message">{error}</div>}

                    {!selectedFile ? (
                        <div
                            className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                        >
                            <div className="drop-icon">📁</div>
                            <p>Drag & Drop your image here</p>
                            <p>or</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                id="file-input"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="file-input" className="choose-file-btn">
                                Choose File
                            </label>
                            <p className="file-hint">Max size: 5MB • JPG, PNG, GIF, WebP</p>
                        </div>
                    ) : (
                        <div className="upload-preview">
                            <img src={preview} alt="Preview" />
                            <p className="file-name">{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                            <button className="change-file-btn" onClick={() => { setSelectedFile(null); setPreview(''); }}>
                                Change File
                            </button>

                            <div className="form-group">
                                <label>Caption (optional):</label>
                                <textarea
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="Add a caption for your photo..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={handleClose}>Cancel</button>
                    <button
                        className="btn-primary"
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                </div>
            </div>
        </div>
    );
}
