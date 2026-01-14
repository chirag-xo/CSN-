import type { ConnectionRequest } from '../../services/connectionService';

interface PendingRequestCardProps {
    request: ConnectionRequest;
    onAccept: () => void;
    onDecline: () => void;
}

export default function PendingRequestCard({ request, onAccept, onDecline }: PendingRequestCardProps) {
    const { requester, message, createdAt } = request;

    if (!requester) return null;

    const fullName = `${requester.firstName} ${requester.lastName}`;
    const initials = `${requester.firstName[0]}${requester.lastName[0]}`;

    const getFullPhotoUrl = (url: string | null): string | null => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${url}`;
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="pending-request-card">
            <div className="request-user">
                <div className="user-avatar">
                    {requester.profilePhoto ? (
                        <img src={getFullPhotoUrl(requester.profilePhoto) || ''} alt={fullName} />
                    ) : (
                        <div className="avatar-placeholder">{initials}</div>
                    )}
                </div>

                <div className="user-info">
                    <h4>{fullName}</h4>
                    {requester.position && requester.company && (
                        <p className="user-title">
                            {requester.position} @ {requester.company}
                        </p>
                    )}
                    {requester.city && <p className="user-location">📍 {requester.city}</p>}

                    {message && (
                        <p className="request-message">
                            <em>"{message}"</em>
                        </p>
                    )}

                    <p className="request-time">{formatTimeAgo(createdAt)}</p>
                </div>
            </div>

            <div className="request-actions">
                <button onClick={onAccept} className="accept-btn">
                    ✓ Accept
                </button>
                <button onClick={onDecline} className="decline-btn">
                    ✕ Decline
                </button>
            </div>
        </div>
    );
}
