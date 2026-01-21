import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import profileService, { type Profile } from '../../services/profileService';
import searchService, { type SearchResult } from '../../services/searchService';
import UserResultCard from '../search/UserResultCard';
import { useDebounce } from '../../hooks/useDebounce';
import { Search, ChevronDown, Menu, User, Settings, LogOut, X } from 'lucide-react';
import UserProfileMenu from './UserProfileMenu';
import '../../styles/topBar.css';

interface TopBarProps {
    onMenuClick?: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const debouncedSearch = useDebounce(searchQuery, 300);
    const searchRef = useRef<HTMLDivElement>(null);

    // Detect mobile screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const getFullPhotoUrl = (url: string | null): string => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${url}`;
    };

    const userInitials = profile ? `${profile.firstName[0]}${profile.lastName[0]}` : 'U';

    return (
        <div className="top-bar">
            <div className="top-bar-container">
                {/* --- Left Section: Mobile Menu & Logo --- */}
                <div className="top-bar-left">
                    <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
                        <Menu size={24} />
                    </button>
                    <div className="top-bar-logo">
                        <img src="/csn.png" alt="CSN" className="top-bar-logo-img" />
                    </div>
                </div>

                {/* --- Center Section: Search --- */}
                <div className="top-bar-center">
                    <div className="search-wrapper" ref={searchRef}>
                        <div className="search-icon-wrapper">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search people, events, businesses..."
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        {isSearching && <span className="search-loading">⏳</span>}
                        {searchQuery && (
                            <button className="search-clear-btn" onClick={clearSearch}>
                                <X size={16} />
                            </button>
                        )}

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
                </div>

                {/* --- Right Section: Actions --- */}
                <div className="top-bar-right">


                    {profile && (
                        <UserProfileMenu
                            user={{
                                name: `${profile.firstName} ${profile.lastName}`,
                                photoUrl: getFullPhotoUrl(profile.profilePhoto),
                                initials: userInitials,
                                userId: profile.id
                            }}
                            onLogout={handleLogout}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
