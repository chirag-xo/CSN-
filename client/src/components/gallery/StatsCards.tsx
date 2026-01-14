import '../styles/gallery.css';

interface StatsCardsProps {
    totalPhotos: number;
    photosWithCaptions: number;
    featuredPhotos: number;
    completionScore: number;
}

export default function StatsCards({ totalPhotos, photosWithCaptions, featuredPhotos, completionScore }: StatsCardsProps) {
    return (
        <div className="stats-cards-container">
            <div className="stat-card-small">
                <div className="stat-value-large">{totalPhotos}</div>
                <div className="stat-label-small">Photos</div>
            </div>
            <div className="stat-card-small">
                <div className="stat-value-large">{photosWithCaptions}</div>
                <div className="stat-label-small">Captioned</div>
            </div>
            <div className="stat-card-small">
                <div className="stat-value-large">{featuredPhotos}</div>
                <div className="stat-label-small">Featured</div>
            </div>
            <div className="stat-card-small score">
                <div className="stat-value-large">{completionScore}%</div>
                <div className="stat-label-small">Score</div>
            </div>
        </div>
    );
}
