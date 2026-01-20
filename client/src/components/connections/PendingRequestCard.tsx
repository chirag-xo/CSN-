import type { ConnectionRequest } from '../../services/connectionService';
import { Check, X, MapPin } from 'lucide-react';

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

    const getFullPhotoUrl = (url: string | null): string => {
        if (!url) return `https://ui-avatars.com/api/?name=${requester.firstName}+${requester.lastName}&background=6D28D9&color=fff`;
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
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="pending-request-card">
            <div className="user-avatar">
                <img
                    src={getFullPhotoUrl(requester.profilePhoto)}
                    alt={fullName}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${requester.firstName}+${requester.lastName}&background=6D28D9&color=fff`;
                    }}
                />
            </div>

            <div className="user-info">
                <h4>{fullName}</h4>
                {requester.position && requester.company && (
                    <p className="connection-role">
                        {requester.position} @ {requester.company}
                    </p>
                )}
                <div className="connection-meta">
                    {requester.city && (
                        <>
                            <span>
                                <MapPin size={14} />
                                {requester.city}
                            </span>
                            <span className="meta-separator">·</span>
                        </>
                    )}
                    <span>Requested {formatTimeAgo(createdAt)}</span>
                </div>

                {message && (
                    <p className="request-message">
                        "{message}"
                    </p>
                )}
            </div>

            <div className="request-actions">
                <button onClick={onAccept} className="action-btn primary">
                    <Check size={16} />
                    Accept
                </button>
                <button onClick={onDecline} className="action-btn destructive">
                    <X size={16} />
                    Decline
                </button>
            </div>
        </div>
    );
}
