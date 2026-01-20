import type { ConnectionRequest } from '../../services/connectionService';
import { MapPin, X } from 'lucide-react';

interface SentRequestCardProps {
    request: ConnectionRequest;
    onCancel: () => void;
}

export default function SentRequestCard({ request, onCancel }: SentRequestCardProps) {
    const { addressee, createdAt } = request;

    if (!addressee) return null;

    const fullName = `${addressee.firstName} ${addressee.lastName}`;
    const initials = `${addressee.firstName[0]}${addressee.lastName[0]}`;

    const getFullPhotoUrl = (url: string | null): string => {
        if (!url) return `https://ui-avatars.com/api/?name=${addressee.firstName}+${addressee.lastName}&background=6D28D9&color=fff`;
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${url}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="sent-request-card">
            <div className="user-avatar">
                <img
                    src={getFullPhotoUrl(addressee.profilePhoto)}
                    alt={fullName}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${addressee.firstName}+${addressee.lastName}&background=6D28D9&color=fff`;
                    }}
                />
            </div>

            <div className="user-info">
                <h4>{fullName}</h4>
                {addressee.position && addressee.company && (
                    <p className="connection-role">
                        {addressee.position} @ {addressee.company}
                    </p>
                )}
                <div className="connection-meta">
                    {addressee.city && (
                        <span>
                            <MapPin size={14} />
                            {addressee.city}
                        </span>
                    )}
                    <span className="meta-separator">·</span>
                    <span>Sent {formatDate(createdAt)}</span>
                </div>
            </div>

            <span className="status-badge pending">Pending</span>

            <div className="request-actions">
                <button onClick={onCancel} className="action-btn destructive">
                    <X size={16} />
                    Cancel Request
                </button>
            </div>
        </div>
    );
}
