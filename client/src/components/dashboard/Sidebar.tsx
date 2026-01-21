import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, Users, Repeat, Calendar, Image, Mail, Info } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import '../../styles/sidebar.css';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    onContactClick?: () => void;
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

interface MenuItem {
    path: string;
    icon: React.ElementType;
    label: string;
    subItems?: Array<{ path: string; label: string }>;
}

export default function Sidebar({ collapsed, onToggle, onContactClick, mobileOpen, onMobileClose }: SidebarProps) {
    const location = useLocation();

    // Map Lucide icons to menu items
    const menuItems: MenuItem[] = [
        { path: '/dashboard/home', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/dashboard/profile', icon: User, label: 'My Profile' },
        { path: '/dashboard/home/connections', icon: Users, label: 'Connections' },
        { path: '/dashboard/home/referrals', icon: Repeat, label: 'Referrals' },
        { path: '/dashboard/home/events', icon: Calendar, label: 'Events' },
        { path: '/dashboard/home/gallery', icon: Image, label: 'Picture Gallery' },
        { path: '/dashboard/contact', icon: Mail, label: 'Contact Us' }
    ];

    // Check if a route is active (simple includes check for sub-routes if needed)
    const isActive = (path: string) => location.pathname === path || (path !== '/dashboard/home' && location.pathname.startsWith(path));

    // Info Menu State
    const [showInfo, setShowInfo] = useState(false);
    const infoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
                setShowInfo(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>

            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <div key={item.path}>
                            <Link
                                to={item.path}
                                className={`nav-item ${active ? 'active' : ''}`}
                                onClick={onMobileClose}
                            >
                                <span className="nav-icon">
                                    <Icon size={20} strokeWidth={2} />
                                </span>
                                {!collapsed && <span className="nav-label">{item.label}</span>}
                                {/* Tooltip - styled in sidebar.css */}
                                {collapsed && <span className="nav-tooltip">{item.label}</span>}
                            </Link>

                            {item.subItems && !collapsed && (
                                <div className="sub-menu">
                                    {item.subItems.map(subItem => (
                                        <Link
                                            key={subItem.path}
                                            to={subItem.path}
                                            className={`sub-item ${location.pathname === subItem.path ? 'active' : ''}`}
                                            onClick={onMobileClose}
                                        >
                                            {subItem.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>


            {/* Sidebar Footer - Info Icon */}
            <div className="sidebar-footer" ref={infoRef}>
                <button
                    className={`nav-item info-button ${showInfo ? 'active' : ''}`}
                    onClick={() => setShowInfo(!showInfo)}
                >
                    <span className="nav-icon">
                        <Info size={20} strokeWidth={2} />
                    </span>
                    {!collapsed && <span className="nav-label">Legal & Info</span>}
                </button>

                {/* Info Popover */}
                <div className={`info-popover ${showInfo ? 'show' : ''}`}>
                    <Link to="/terms-of-service" className="info-menu-item">Terms of Use</Link>
                    <Link to="/privacy" className="info-menu-item">Privacy Policy</Link>
                    <div className="info-divider"></div>
                    <div className="info-copyright">Copyright 2026 CSN. All Rights Reserved.</div>
                </div>
            </div>
        </aside >
    );
}
