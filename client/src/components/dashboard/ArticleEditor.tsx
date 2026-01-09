import { useRef, useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '../../styles/articleEditor.css';

interface ArticleEditorProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ArticleEditor({ isOpen, onClose }: ArticleEditorProps) {
    const [title, setTitle] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const coverImageInputRef = useRef<HTMLInputElement>(null);
    const editorRef = useRef<Editor>(null);

    if (!isOpen) return null;

    const handleCoverImageClick = () => {
        coverImageInputRef.current?.click();
    };

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePublish = () => {
        const editorInstance = editorRef.current?.getInstance();
        const content = editorInstance?.getMarkdown() || '';

        console.log('Publishing article:', { title, content, coverImage });
        // TODO: Implement article publishing

        setTitle('');
        setCoverImage(null);
        editorInstance?.setMarkdown('');
        onClose();
    };

    return (
        <div className="article-editor-overlay" onClick={onClose}>
            <div className="article-editor-container" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="article-editor-header">
                    <div className="article-editor-user">
                        <div className="article-editor-avatar"></div>
                        <span>Individual article</span>
                    </div>
                    <div className="article-editor-actions">
                        <button className="editor-btn-primary" onClick={handlePublish}>Post</button>
                    </div>
                </div>

                {/* Cover Image Section */}
                <div className="article-cover-section">
                    {coverImage ? (
                        <div className="article-cover-preview">
                            <img src={coverImage} alt="Cover" />
                            <button
                                className="remove-cover-btn"
                                onClick={() => setCoverImage(null)}
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <div className="article-cover-placeholder">
                            <div className="cover-icon">🖼️</div>
                            <p>Add a cover image or video to your article.</p>
                            <button className="upload-cover-btn" onClick={handleCoverImageClick}>
                                ⬆ Upload from computer
                            </button>
                        </div>
                    )}
                </div>

                {/* Title Input */}
                <div className="article-title-section">
                    <input
                        type="text"
                        className="article-title-input"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* TOAST UI Editor */}
                <div className="article-content-section">
                    <Editor
                        ref={editorRef}
                        initialValue="Write your article here..."
                        previewStyle="vertical"
                        height="400px"
                        initialEditType="wysiwyg"
                        useCommandShortcut={true}
                        toolbarItems={[
                            ['heading', 'bold', 'italic', 'strike'],
                            ['hr', 'quote'],
                            ['ul', 'ol', 'task'],
                            ['table', 'link', 'image'],
                            ['code', 'codeblock']
                        ]}
                    />
                </div>

                {/* Hidden file input */}
                <input
                    ref={coverImageInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleCoverImageChange}
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
}
