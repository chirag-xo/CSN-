import { useState, useEffect, useRef } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../styles/userProfileMenu.css';

interface UserProfileMenuProps {
    user: {
        name: string;
        photoUrl?: string | null;
        initials: string;
        userId: string;
    };
    onLogout: () => void;
}

export default function UserProfileMenu({ user, onLogout }: UserProfileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleNavigation = (path: string) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <div className="bni-user-menu" ref={dropdownRef}>
            <button
                className={`bni-user-trigger ${isOpen ? 'active' : ''}`}
                onClick={toggleDropdown}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div className="bni-user-avatar">
                    {user.photoUrl ? (
                        <img
                            src={user.photoUrl}
                            alt={user.name}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const placeholder = target.parentElement?.querySelector('.bni-user-initials');
                                if (placeholder) (placeholder as HTMLElement).style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div
                        className="bni-user-initials"
                        style={{ display: user.photoUrl ? 'none' : 'flex' }}
                    >
                        {user.initials}
                    </div>
                </div>
                <span className="bni-user-name">{user.name}</span>
                <ChevronDown
                    size={16}
                    className={`bni-user-chevron ${isOpen ? 'rotate' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="bni-user-dropdown">
                    <button
                        className="bni-dropdown-item"
                        onClick={() => handleNavigation(`/profile/${user.userId}`)}
                    >
                        <User size={18} />
                        <span>My Profile</span>
                    </button>
                    <div className="bni-dropdown-divider" />
                    <button
                        className="bni-dropdown-item text-danger"
                        onClick={onLogout}
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
}
