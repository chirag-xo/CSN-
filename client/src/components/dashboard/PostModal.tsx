import { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { PostDraft } from '../../types/post';
import EventModal from './EventModal';
import PollModal from './PollModal';
import '../../styles/postModal.css';

interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreatePost: (draft: PostDraft) => Promise<void>;
}

export default function PostModal({ isOpen, onClose, onCreatePost }: PostModalProps) {
    const { user } = useAuth();
    const [postContent, setPostContent] = useState('');
    const [attachedImages, setAttachedImages] = useState<string[]>([]);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isPollModalOpen, setIsPollModalOpen] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState('');
    const imageInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen || !user) return null;

    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    const fullName = `${user.firstName} ${user.lastName}`;

    const handleImageClick = () => {
        imageInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            const newImages: string[] = [];

            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newImages.push(reader.result as string);
                    if (newImages.length === newFiles.length) {
                        setAttachedImages([...attachedImages, ...newImages]);
                        setAttachedFiles([...attachedFiles, ...newFiles]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handlePost = async () => {
        if (!postContent.trim()) {
            setError('Please enter  some content');
            return;
        }

        setIsPosting(true);
        setError('');

        try {
            const draft: PostDraft = {
                content: postContent,
                media: attachedFiles.length > 0 ? attachedFiles : undefined,
            };

            await onCreatePost(draft);

            // Reset form
            setPostContent('');
            setAttachedImages([]);
            setAttachedFiles([]);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create post');
        } finally {
            setIsPosting(false);
        }
    };

    const removeImage = (index: number) => {
        setAttachedImages(attachedImages.filter((_, i) => i !== index));
    };

    return (
        <div className="post-modal-overlay" onClick={onClose}>
            <div className="post-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="post-modal-header">
                    <div className="post-modal-user">
                        <div className="post-modal-avatar">{initials}</div>
                        <div>
                            <div className="post-modal-name">{fullName} ▼</div>
                            <div className="post-modal-visibility">Post to Anyone</div>
                        </div>
                    </div>
                    <button className="post-modal-close" onClick={onClose}>✕</button>
                </div>

                {/* Content */}
                <div className="post-modal-content">
                    <textarea
                        className="post-modal-textarea"
                        placeholder="What do you want to talk about?"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        autoFocus
                    />

                    {/* Attached Images Preview */}
                    {attachedImages.length > 0 && (
                        <div className="post-modal-images">
                            {attachedImages.map((img, index) => (
                                <div key={index} className="post-modal-image-preview">
                                    <img src={img} alt={`Upload ${index + 1}`} />
                                    <button
                                        className="post-modal-remove-image"
                                        onClick={() => removeImage(index)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="post-modal-footer">
                    {error && (
                        <div className="post-modal-error">{error}</div>
                    )}
                    <div className="post-modal-actions">
                        <button className="post-modal-action-btn" onClick={handleImageClick} title="Photo">
                            <img src="/image-icon.png" alt="Photo" className="footer-icon" />
                        </button>
                        <button className="post-modal-action-btn" onClick={() => setIsEventModalOpen(true)} title="Event">
                            <img src="/calendar-icon.png" alt="Event" className="footer-icon" />
                        </button>
                        <button className="post-modal-action-btn" title="Celebrate">
                            <img src="/celebrate-icon.png" alt="Celebrate" className="footer-icon" />
                        </button>
                        <button className="post-modal-action-btn" onClick={() => setIsPollModalOpen(true)} title="Poll">
                            <img src="/poll-icon.png" alt="Poll" className="footer-icon" />
                        </button>
                        <button className="post-modal-action-btn" title="Document">
                            <img src="/document-icon.png" alt="Document" className="footer-icon" />
                        </button>
                    </div>
                    <div className="post-modal-submit">
                        <button
                            className="post-modal-post-btn"
                            onClick={handlePost}
                            disabled={!postContent.trim() || isPosting}
                        >
                            {isPosting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>

                {/* Hidden file input */}
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
            </div>

            {/* Event Modal */}
            <EventModal
                isOpen={isEventModalOpen}
                onClose={() => setIsEventModalOpen(false)}
            />

            {/* Poll Modal */}
            <PollModal
                isOpen={isPollModalOpen}
                onClose={() => setIsPollModalOpen(false)}
            />
        </div>
    );
}
