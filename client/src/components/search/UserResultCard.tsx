import { useNavigate } from 'react-router-dom';
import { type SearchResult } from '../../services/searchService';
import '../../styles/search.css';

interface UserResultCardProps {
    user: SearchResult;
    onClick: () => void;
}

export default function UserResultCard({ user, onClick }: UserResultCardProps) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const profilePhotoUrl = user.profilePhoto ? `${API_URL}${user.profilePhoto}` : null;

    // Connection status badge
    const getStatusBadge = () => {
        switch (user.connectionStatus) {
            case 'CONNECTED':
                return <span className="status-badge connected">✓ Connected</span>;
            case 'PENDING_SENT':
                return <span className="status-badge pending-sent">⏳ Request Sent</span>;
            case 'PENDING_RECEIVED':
                return <span className="status-badge pending-received">📨 Request Received</span>;
            case 'NONE':
                return <span className="status-badge none">➕ Connect</span>;
            default:
                return null;
        }
    };

    // Get user initials for avatar fallback
    const getInitials = () => {
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="user-result-card" onClick={onClick}>
            <div className="user-avatar">
                <img
                    src={
                        user.profilePhoto
                            ? user.profilePhoto.startsWith('http')
                                ? user.profilePhoto
                                : `${API_URL}${user.profilePhoto}`
                            : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6D28D9&color=fff`
                    }
                    alt={`${user.firstName} ${user.lastName}`}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6D28D9&color=fff`;
                    }}
                />
            </div>
            <div className="user-info">
                <div className="user-name-row">
                    <span className="user-name">{user.firstName} {user.lastName}</span>
                    {getStatusBadge()}
                </div>
                {(user.position || user.company) && (
                    <div className="user-role">
                        {user.position}{user.position && user.company && ' at '}{user.company}
                    </div>
                )}
                {user.city && (
                    <div className="user-location">📍 {user.city}</div>
                )}
            </div>
        </div>
    );
}
