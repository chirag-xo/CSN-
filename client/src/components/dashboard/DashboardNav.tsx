import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import profileService, { type Profile } from '../../services/profileService';
import '../../styles/dashboard.css';

export default function DashboardNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await profileService.getProfile();
            console.log('DashboardNav - Profile data:', data);
            console.log('DashboardNav - Profile photo:', data.profilePhoto);
            setProfile(data);
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getFullPhotoUrl = (url: string | null): string | null => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${url}`;
    };

    const userInitials = profile
        ? `${profile.firstName[0]}${profile.lastName[0]}`
        : 'TU';

    return (
        <nav className="dashboard-nav">
            <div className="nav-content">
                {/* Search */}
                <div className="search-container" style={{ position: 'relative' }}>
                    <img src="/search.webp" alt="Search" className="search-icon-img" />
                    <input type="text" className="search-input" placeholder="Search" />
                </div>

                {/* Navigation Items */}
                <div className="nav-items">
                    <Link
                        to="/dashboard"
                        className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                    >
                        <img src="/home.png" alt="Home" className="nav-icon-img" />
                        <span className="nav-label">Home</span>
                    </Link>

                    <Link
                        to="/network"
                        className={`nav-item ${isActive('/network') ? 'active' : ''}`}
                    >
                        <img src="/network.png?v=2" alt="Network" className="nav-icon-img" />
                        <span className="nav-label">My Network</span>
                    </Link>

                    <Link
                        to="/messaging"
                        className={`nav-item ${isActive('/messaging') ? 'active' : ''}`}
                    >
                        <img src="/msg.png" alt="Messaging" className="nav-icon-img" />
                        <span className="nav-label">Messaging</span>
                    </Link>

                    <Link
                        to="/notifications"
                        className={`nav-item ${isActive('/notifications') ? 'active' : ''}`}
                    >
                        <img src="/noti.png?v=2" alt="Notifications" className="nav-icon-img" />
                        <span className="nav-label">Notifications</span>
                    </Link>
                </div>

                {/* Logout Button */}
                <button onClick={handleLogout} className="nav-item logout-btn" title="Logout">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                            d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="nav-label">Logout</span>
                </button>

                {/* Profile Dropdown */}
                <div className="nav-profile-container">
                    <button
                        className="nav-profile"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {profile?.profilePhoto ? (
                            <img
                                src={getFullPhotoUrl(profile.profilePhoto) || ''}
                                alt="Profile"
                                className="profile-avatar"
                            />
                        ) : (
                            <div className="profile-avatar-placeholder">{userInitials}</div>
                        )}
                        <span className="profile-name">
                            {profile ? `${profile.firstName} ${profile.lastName}` : 'Loading...'}
                        </span>
                        <span className="dropdown-arrow">▼</span>
                    </button>

                    {showDropdown && (
                        <div className="profile-dropdown">
                            <Link
                                to="/dashboard/profile"
                                className="dropdown-item"
                                onClick={() => setShowDropdown(false)}
                            >
                                👤 My Profile
                            </Link>
                            <Link
                                to="/dashboard/profile"
                                className="dropdown-item"
                                onClick={() => setShowDropdown(false)}
                            >
                                ⚙️ Settings
                            </Link>
                            <button onClick={handleLogout} className="dropdown-item logout-item">
                                🚪 Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
