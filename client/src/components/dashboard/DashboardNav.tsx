import { Link, useLocation } from 'react-router-dom';
import '../../styles/dashboard.css';

export default function DashboardNav() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="dashboard-nav">
            <div className="nav-content">
                {/* Search */}
                <div className="search-container" style={{ position: 'relative' }}>
                    <img src="/search.webp" alt="Search" className="search-icon-img" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search"
                    />
                </div>

                {/* Navigation Items */}
                <div className="nav-items">
                    <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                        <img src="/home.png" alt="Home" className="nav-icon-img" />
                        <span className="nav-label">Home</span>
                    </Link>

                    <Link to="/network" className={`nav-item ${isActive('/network') ? 'active' : ''}`}>
                        <img src="/network.png?v=2" alt="Network" className="nav-icon-img" />
                        <span className="nav-label">My Network</span>
                    </Link>

                    <Link to="/messaging" className={`nav-item ${isActive('/messaging') ? 'active' : ''}`}>
                        <img src="/msg.png" alt="Messaging" className="nav-icon-img" />
                        <span className="nav-label">Messaging</span>
                    </Link>

                    <Link to="/notifications" className={`nav-item ${isActive('/notifications') ? 'active' : ''}`}>
                        <img src="/noti.png?v=2" alt="Notifications" className="nav-icon-img" />
                        <span className="nav-label">Notifications</span>
                    </Link>
                </div>

                {/* Profile */}
                <Link to="/profile" className="nav-profile">
                    Me
                </Link>
            </div>
        </nav>
    );
}
