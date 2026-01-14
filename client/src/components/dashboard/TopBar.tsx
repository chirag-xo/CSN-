import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import profileService, { type Profile } from '../../services/profileService';
import searchService, { type SearchResult } from '../../services/searchService';
import UserResultCard from '../search/UserResultCard';
import { useDebounce } from '../../hooks/useDebounce';

export default function TopBar() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const debouncedSearch = useDebounce(searchQuery, 300);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setProfile(data);
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    // Search effect
    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearch.length >= 2) {
                setIsSearching(true);
                try {
                    const results = await searchService.searchUsers(debouncedSearch);
                    setSearchResults(results);
                    setShowSearchDropdown(true);
                } catch (error) {
                    console.error('Search error:', error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
                setShowSearchDropdown(false);
            }
        };

        performSearch();
    }, [debouncedSearch]);

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleResultClick = (userId: string) => {
        navigate(`/profile/${userId}`);
        setShowSearchDropdown(false);
        setSearchQuery('');
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchDropdown(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getFullPhotoUrl = (url: string | null): string | null => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${url}`;
    };

    const userInitials = profile ? `${profile.firstName[0]}${profile.lastName[0]}` : 'TU';

    return (
        <div className="top-bar">
            <div className="top-bar-content">
                {/* Logo Section */}
                <div className="top-bar-logo">
                    <img src="/logo1.png" alt="CSN" className="top-bar-logo-img" />
                    <span className="top-bar-logo-text">CSN</span>
                </div>

                {/* Search */}
                <div className="search-box" ref={searchRef}>
                    <div className="search-wrapper">
                        <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
                            <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search people, events, businesses..."
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        {isSearching && <span className="search-loading">⏳</span>}
                        {searchQuery && (
                            <button className="search-clear-btn" onClick={clearSearch}>✕</button>
                        )}
                    </div>

                    {/* Autocomplete Dropdown */}
                    {showSearchDropdown && (
                        <div className="search-dropdown">
                            {searchResults.length > 0 ? (
                                <>
                                    {searchResults.map((user) => (
                                        <UserResultCard
                                            key={user.id}
                                            user={user}
                                            onClick={() => handleResultClick(user.id)}
                                        />
                                    ))}
                                    {searchResults.length >= 10 && (
                                        <div className="search-footer">
                                            Showing top 10 results
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="search-empty">
                                    No users found matching "{searchQuery}"
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Section */}
                <div className="top-bar-actions">
                    {/* Notifications */}
                    <button className="icon-button" title="Notifications">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className="notification-badge">3</span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="profile-dropdown-container">
                        <button
                            className="profile-button"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            {profile?.profilePhoto ? (
                                <img
                                    src={getFullPhotoUrl(profile.profilePhoto) || ''}
                                    alt="Profile"
                                    className="profile-avatar-small"
                                />
                            ) : (
                                <div className="profile-avatar-placeholder-small">{userInitials}</div>
                            )}
                            <span className="profile-name-text">
                                {profile ? `${profile.firstName} ${profile.lastName}` : 'Loading...'}
                            </span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </button>

                        {showDropdown && (
                            <div className="profile-dropdown-menu">
                                <Link
                                    to="/dashboard/profile"
                                    className="dropdown-menu-item"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    👤 My Profile
                                </Link>
                                <Link
                                    to="/dashboard/profile"
                                    className="dropdown-menu-item"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    ⚙️ Settings
                                </Link>
                                <button onClick={handleLogout} className="dropdown-menu-item logout-menu-item">
                                    🚪 Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
