import { Link } from 'react-router-dom';
import type { Connection } from '../../services/connectionService';
import { User, MessageCircle, UserMinus, MapPin } from 'lucide-react';

interface ConnectionCardProps {
    connection: Connection;
    onRemove: () => void;
}

export default function ConnectionCard({ connection, onRemove }: ConnectionCardProps) {
    const { user, connectedSince } = connection;
    const fullName = `${user.firstName} ${user.lastName}`;
    const initials = `${user.firstName[0]}${user.lastName[0]}`;

    const getFullPhotoUrl = (url: string | null): string => {
        if (!url) return `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6D28D9&color=fff`;
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${url}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <div className="connection-card">
            <Link to={`/profile/${user.id}`} className="connection-avatar">
                <img
                    src={getFullPhotoUrl(user.profilePhoto)}
                    alt={fullName}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6D28D9&color=fff`;
                    }}
                />
            </Link>

            <div className="connection-info">
                <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h4 className="connection-name">{fullName}</h4>
                </Link>
                {user.position && user.company && (
                    <p className="connection-role">
                        {user.position} @ {user.company}
                    </p>
                )}
                <div className="connection-meta">
                    {user.city && (
                        <span>
                            <MapPin size={14} />
                            {user.city}
                        </span>
                    )}
                    {user.city && <span className="meta-separator">·</span>}
                    <span>Connected {formatDate(connectedSince)}</span>
                </div>
            </div>

            <div className="connection-actions">
                <Link to={`/profile/${user.id}`} className="action-btn primary">
                    <User size={16} />
                    View Profile
                </Link>
                <button className="action-btn secondary" title="Message">
                    <MessageCircle size={16} />
                    Message
                </button>
                <button className="action-btn-icon destructive" onClick={onRemove} title="Remove connection">
                    <UserMinus size={18} />
                </button>
            </div>
        </div>
    );
}
