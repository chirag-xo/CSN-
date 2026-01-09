import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/'); // Redirect to home on success
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="login-page">
            {/* Back Button */}
            <Link to="/" className="back-button">
                <img src="/back.jpg" alt="Back to Home" />
            </Link>

            <div className="login-container">
                {/* Left Column: Login Form */}
                <div className="login-form-section">
                    <div className="form-wrapper">
                        {/* Header */}
                        <div className="login-header">
                            <h1 className="login-title">Login</h1>
                            <p className="login-subtitle">Enter your details to login into your account</p>
                        </div>

                        {/* Google Sign In */}
                        <button className="google-signin-btn" type="button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4" />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853" />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05" />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335" />
                            </svg>
                            <span>Sign in with Google</span>
                        </button>

                        {/* Divider */}
                        <div className="divider">
                            <span>------ or sign in with Email ------</span>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div style={{
                                color: '#ff6b6b',
                                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                padding: '12px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                                fontSize: '14px'
                            }}>
                                {error}
                            </div>
                        )}

                        {/* Form Fields */}
                        <form className="login-form" onSubmit={handleSubmit}>
                            {/* Email Field */}
                            <div className="input-group">
                                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
                                        fill="white" />
                                    <path d="M10 12.5C5.58172 12.5 2 14.7386 2 17.5V20H18V17.5C18 14.7386 14.4183 12.5 10 12.5Z"
                                        fill="white" />
                                </svg>
                                <input
                                    type="email"
                                    className="login-input"
                                    placeholder="Enter your Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="input-group">
                                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M15.8333 9.16667H15V6.66667C15 3.90833 12.7583 1.66667 10 1.66667C7.24167 1.66667 5 3.90833 5 6.66667V9.16667H4.16667C3.25 9.16667 2.5 9.91667 2.5 10.8333V17.5C2.5 18.4167 3.25 19.1667 4.16667 19.1667H15.8333C16.75 19.1667 17.5 18.4167 17.5 17.5V10.8333C17.5 9.91667 16.75 9.16667 15.8333 9.16667ZM10 15C9.08333 15 8.33333 14.25 8.33333 13.3333C8.33333 12.4167 9.08333 11.6667 10 11.6667C10.9167 11.6667 11.6667 12.4167 11.6667 13.3333C11.6667 14.25 10.9167 15 10 15ZM12.9167 9.16667H7.08333V6.66667C7.08333 5.05833 8.39167 3.75 10 3.75C11.6083 3.75 12.9167 5.05833 12.9167 6.66667V9.16667Z"
                                        fill="white" />
                                </svg>
                                <input
                                    type="password"
                                    className="login-input"
                                    placeholder="Enter your Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="auth-options">
                                <label className="remember-me">
                                    <input type="checkbox" className="checkbox" />
                                    <span>Remember Me</span>
                                </label>
                                <a href="#" className="forgot-password">Forgot Password</a>
                            </div>

                            {/* Login Button */}
                            <button type="submit" className="login-submit-btn" disabled={loading}>
                                {loading ? 'LOGGING IN...' : 'LOGIN'}
                            </button>
                        </form>

                        {/* Footer */}
                        <p className="signup-prompt">
                            Not registered Yet? <Link to="/signup" className="signup-link">Create an account</Link>
                        </p>
                    </div>
                </div>

                {/* Right Column: Earth Image */}
                <div className="login-image-section">
                    <img src="/login.png" alt="Login Illustration" className="earth-image" />
                </div>
            </div>
        </div>
    );
}
