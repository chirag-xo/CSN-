import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

interface MenuItem {
    path: string;
    icon: string;
    label: string;
    subItems?: Array<{ path: string; label: string }>;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const location = useLocation();

    const menuItems: MenuItem[] = [
        { path: '/dashboard/home', icon: '/dashboard.png', label: 'Dashboard' },
        { path: '/dashboard/profile', icon: '/profile-picture.png', label: 'My Profile' },
        { path: '/dashboard/home/connections', icon: '/customer.png', label: 'Connections' },
        { path: '/dashboard/home/referrals', icon: '/repeat (1).png', label: 'Referrals' },
        { path: '/dashboard/home/events', icon: '/calendar.png', label: 'Events' },
        { path: '/dashboard/home/gallery', icon: '/picture.png', label: 'Picture Gallery' }
    ];

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <img src="/logo1.png" alt="CSN" className="logo-img" />
                    {!collapsed && <span className="logo-text">CSN</span>}
                </div>
                <button onClick={onToggle} className="toggle-btn">
                    {collapsed ? '→' : '←'}
                </button>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <div key={item.path}>
                        <Link
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">
                                {item.icon.endsWith('.svg') ? (
                                    <img src={item.icon} alt={item.label} className="icon-svg-img" />
                                ) : item.icon.endsWith('.png') ? (
                                    <img
                                        src={item.icon}
                                        alt={item.label}
                                        className={item.label === 'Picture Gallery' ? 'icon-img icon-img-large' : 'icon-img'}
                                    />
                                ) : (
                                    item.icon
                                )}
                            </span>
                            {!collapsed && <span className="nav-label">{item.label}</span>}
                        </Link>

                        {item.subItems && !collapsed && (
                            <div className="sub-menu">
                                {item.subItems.map(subItem => (
                                    <Link
                                        key={subItem.path}
                                        to={subItem.path}
                                        className={`sub-item ${location.pathname === subItem.path ? 'active' : ''}`}
                                    >
                                        {subItem.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
}
