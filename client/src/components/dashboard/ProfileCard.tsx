import { useAuth } from '../../contexts/AuthContext';
import '../../styles/dashboard.css';

export default function ProfileCard() {
    const { user } = useAuth();

    if (!user) return null;

    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

    return (
        <div className="dashboard-card profile-card">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-name">{user.firstName} {user.lastName}</div>
            <div className="profile-bio">{user.position || 'Professional'} {user.company && `at ${user.company}`}</div>

            <div className="profile-stats">
                <div className="stat-item">
                    <div className="stat-value">128</div>
                    <div className="stat-label">Connections</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">342</div>
                    <div className="stat-label">Profile Views</div>
                </div>
            </div>
        </div>
    );
}
