import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ImageLightboxProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onNavigate: (index: number) => void;
    postContent?: string;
    author?: {
        name: string;
        role: string;
    };
}

export default function ImageLightbox({
    images,
    currentIndex,
    onClose,
    onNavigate,
    postContent,
    author
}: ImageLightboxProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Fade in animation on mount
    useEffect(() => {
        // Trigger animation after mount
        requestAnimationFrame(() => {
            setIsVisible(true);
        });
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                onNavigate(currentIndex - 1);
            }
            if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
                onNavigate(currentIndex + 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, images.length, onNavigate]);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Focus trap - focus first element
    useEffect(() => {
        const closeButton = document.querySelector('.lightbox-close') as HTMLElement;
        closeButton?.focus();
    }, []);

    const handleClose = () => {
        // Fade out animation before closing
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 200); // Match animation duration
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            onNavigate(currentIndex + 1);
        }
    };

    const lightboxContent = (
        <div
            className={`image-lightbox-overlay ${isVisible ? 'visible' : ''}`}
            onClick={handleClose}
        >
            <div className="image-lightbox-container" onClick={(e) => e.stopPropagation()}>
                {/* Close button */}
                <button
                    className="lightbox-close"
                    onClick={handleClose}
                    aria-label="Close lightbox"
                >
                    ✕
                </button>

                {/* Image counter */}
                {images.length > 1 && (
                    <div className="lightbox-counter">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}

                {/* Main image area */}
                <div className="lightbox-image-area">
                    {/* Previous button */}
                    {currentIndex > 0 && (
                        <button
                            className="lightbox-nav lightbox-nav-prev"
                            onClick={handlePrevious}
                            aria-label="Previous image"
                        >
                            ‹
                        </button>
                    )}

                    {/* Current image */}
                    <img
                        key={currentIndex} // Triggers animation on image change
                        src={images[currentIndex]}
                        alt={`Image ${currentIndex + 1}`}
                        className="lightbox-image"
                    />

                    {/* Next button */}
                    {currentIndex < images.length - 1 && (
                        <button
                            className="lightbox-nav lightbox-nav-next"
                            onClick={handleNext}
                            aria-label="Next image"
                        >
                            ›
                        </button>
                    )}
                </div>

                {/* Optional sidebar with post info */}
                {(postContent || author) && (
                    <div className="lightbox-sidebar">
                        {author && (
                            <div className="lightbox-author">
                                <div className="lightbox-author-avatar"></div>
                                <div className="lightbox-author-info">
                                    <div className="lightbox-author-name">{author.name}</div>
                                    <div className="lightbox-author-role">{author.role}</div>
                                </div>
                            </div>
                        )}
                        {postContent && (
                            <div className="lightbox-content">
                                {postContent}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    // Render using Portal to document.body
    return createPortal(lightboxContent, document.body);
}
