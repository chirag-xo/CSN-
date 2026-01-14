import { Link } from 'react-router-dom';
import type { Connection } from '../../services/connectionService';

interface ConnectionCardProps {
    connection: Connection;
    onRemove: () => void;
}

export default function ConnectionCard({ connection, onRemove }: ConnectionCardProps) {
    const { user, connectedSince } = connection;
    const fullName = `${user.firstName} ${user.lastName}`;
    const initials = `${user.firstName[0]}${user.lastName[0]}`;

    const getFullPhotoUrl = (url: string | null): string | null => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${url}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div className="connection-card">
            <Link to={`/profile/${user.id}`} className="connection-link">
                <div className="connection-avatar">
                    {user.profilePhoto ? (
                        <img src={getFullPhotoUrl(user.profilePhoto) || ''} alt={fullName} />
                    ) : (
                        <div className="avatar-placeholder">{initials}</div>
                    )}
                </div>

                <div className="connection-info">
                    <h4 className="connection-name">{fullName}</h4>
                    {user.position && <p className="connection-position">{user.position}</p>}
                    {user.company && <p className="connection-company">{user.company}</p>}
                    {user.city && <p className="connection-location">📍 {user.city}</p>}
                    <p className="connection-date">Connected {formatDate(connectedSince)}</p>
                </div>
            </Link>

            <div className="connection-actions">
                <button className="action-btn message-btn" title="Message">
                    💬
                </button>
                <button className="action-btn more-btn" onClick={onRemove} title="Remove">
                    ⋮
                </button>
            </div>
        </div>
    );
}
