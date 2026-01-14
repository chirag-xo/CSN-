import '../styles/gallery.css';

interface GalleryStats {
    totalPhotos: number;
    photosWithCaptions: number;
    featuredPhotos: number;
    completionScore: number;
}

interface GalleryStatsWidgetProps {
    stats: GalleryStats;
    onUploadClick: () => void;
}

export default function GalleryStatsWidget({ stats, onUploadClick }: GalleryStatsWidgetProps) {
    const { totalPhotos, photosWithCaptions, featuredPhotos, completionScore } = stats;

    // Calculate next steps
    const suggestions = [];
    if (totalPhotos < 10) {
        suggestions.push(`Add ${10 - totalPhotos} more photos (boost to ${Math.min(completionScore + 20, 100)}%)`);
    }
    if (photosWithCaptions < Math.ceil(totalPhotos * 0.5)) {
        const needed = Math.ceil(totalPhotos * 0.5) - photosWithCaptions;
        suggestions.push(`Add captions to ${needed} photos`);
    }
    if (featuredPhotos < 3) {
        suggestions.push(`Feature ${3 - featuredPhotos} more photos`);
    }

    if (completionScore >= 100) {
        return null; // Hide widget when gallery is complete
    }

    return (
        <div className="gallery-stats-widget">
            <div className="widget-header">
                <h3>📸 Gallery Strength</h3>
            </div>

            <div className="widget-body">
                {/* Progress Circle */}
                <div className="progress-circle">
                    <svg width="120" height="120">
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="8"
                        />
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="#6D28D9"
                            strokeWidth="8"
                            strokeDasharray={`${completionScore * 3.39} 339`}
                            strokeLinecap="round"
                            transform="rotate(-90 60 60)"
                        />
                    </svg>
                    <div className="progress-text">
                        <div className="percentage">{completionScore}%</div>
                        <div className="label">Complete</div>
                    </div>
                </div>

                {/* Benefits */}
                <div className="benefits">
                    <h4>Complete your gallery to:</h4>
                    <ul>
                        <li>🔍 Showcase your work professionally</li>
                        <li>🤝 Attract more connections</li>
                        <li>⭐ Build credibility</li>
                    </ul>
                </div>

                {/* Next Steps */}
                {suggestions.length > 0 && (
                    <div className="next-steps">
                        <h4>Next Steps:</h4>
                        <ul>
                            {suggestions.map((suggestion, index) => (
                                <li key={index}>• {suggestion}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* CTA Button */}
                <button className="widget-cta-btn" onClick={onUploadClick}>
                    ➕ Upload More Photos
                </button>
            </div>
        </div>
    );
}
