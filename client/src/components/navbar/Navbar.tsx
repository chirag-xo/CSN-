import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <>
            <div className="logo">
                <img src="/csn.png" alt="CSN Logo" className="logo-image" />
            </div>
            <nav className="navigation">
                <a href="#features" className="nav-link">Features</a>
                <a href="#purpose-section" className="nav-link">About</a>
                <div className="login-button-container">
                    <Link to="/login" className="login-button">Login</Link>
                </div>
            </nav>
        </>
    );
}
