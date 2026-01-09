import { useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { PostDraft } from '../../types/post';
import ArticleEditor from './ArticleEditor';
import PostModal from './PostModal';
import '../../styles/dashboard.css';

interface PostCreatorProps {
    onCreatePost: (draft: PostDraft) => Promise<void>;
}

export default function PostCreator({ onCreatePost }: PostCreatorProps) {
    const { user } = useAuth();
    const photoInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [isArticleEditorOpen, setIsArticleEditorOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    const handlePostClick = () => {
        setIsPostModalOpen(true);
    };

    const handlePhotoClick = () => {
        photoInputRef.current?.click();
    };

    const handleVideoClick = () => {
        videoInputRef.current?.click();
    };

    const handleArticleClick = () => {
        setIsArticleEditorOpen(true);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('Selected photo:', file.name);
            // TODO: Handle photo upload
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('Selected video:', file.name);
            // TODO: Handle video upload
        }
    };

    if (!user) return null;

    return (
        <>
            <div className="dashboard-card post-creator">
                <div className="post-input-wrapper">
                    <div className="post-avatar"></div>
                    <input
                        type="text"
                        className="post-input"
                        placeholder="Start a post"
                        onClick={handlePostClick}
                        readOnly
                    />
                </div>

                <div className="post-actions">
                    <button className="post-action-btn" onClick={handleVideoClick}>
                        <img src="/video.png" alt="Video" className="action-icon-img" />
                        <span>Video</span>
                    </button>
                    <button className="post-action-btn" onClick={handlePhotoClick}>
                        <img src="/photo.png" alt="Photo" className="action-icon-img" />
                        <span>Photo</span>
                    </button>
                    <button className="post-action-btn" onClick={handleArticleClick}>
                        <img src="/article.png" alt="Article" className="action-icon-img" />
                        <span>Article</span>
                    </button>
                </div>

                {/* Hidden file inputs */}
                <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                />
                <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    style={{ display: 'none' }}
                />
            </div>

            {/* Post Modal */}
            <PostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onCreatePost={onCreatePost}
            />

            {/* Article Editor Modal */}
            <ArticleEditor
                isOpen={isArticleEditorOpen}
                onClose={() => setIsArticleEditorOpen(false)}
            />
        </>
    );
}
