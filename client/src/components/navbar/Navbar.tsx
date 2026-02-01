import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <>
            <div className="navbar-wrapper">
                <div className="logo">
                    <img src="/csn.png" alt="CSN Logo" className="logo-image" />
                </div>
                <nav className="navigation">
                    <a href="#features" className="nav-link nav-features">Features</a>
                    <a href="#purpose-section" className="nav-link nav-about">About</a>
                    <Link to="/franchise" className="nav-link franchise-nav-link">Franchise</Link>
                    <div className="login-button-container">
                        <Link to="/login" className="login-button">Login</Link>
                    </div>
                </nav>
            </div>
        </>
    );
}
