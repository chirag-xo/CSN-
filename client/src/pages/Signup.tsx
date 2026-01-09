import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/signup.css';

export default function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register({ firstName, lastName, email, password });
            navigate('/'); // Redirect to home on success
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="signup-page">
            {/* Cancel Button */}
            <Link to="/" className="cancel-button">
                <img src="/cancel.png" alt="Cancel" />
            </Link>

            <div className="signup-container">
                {/* Left Column: Image */}
                <div className="signup-image-section">
                    <img src="/signup.png" alt="Signup Illustration" className="earth-image" />
                </div>

                {/* Right Column: Signup Form */}
                <div className="signup-form-section">
                    <div className="signup-form-content">
                        {/* Header */}
                        <h1 className="signup-title">SignUp</h1>
                        <p className="signup-subtitle">Enter your details to create your account</p>

                        {/* Google Sign Up Button */}
                        <button className="google-signup-btn" type="button">
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
                            <span>Sign up with Google</span>
                        </button>

                        {/* Divider */}
                        <div className="divider">
                            <span>------ or use your email for registration ------</span>
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
                        <form className="signup-form" onSubmit={handleSubmit}>
                            {/* First Name Input */}
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
                                    type="text"
                                    className="signup-input"
                                    placeholder="Enter your First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Last Name Input */}
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
                                    type="text"
                                    className="signup-input"
                                    placeholder="Enter your Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email Input */}
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
                                    className="signup-input"
                                    placeholder="Enter your Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="input-group">
                                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M15 8H14V6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6V8H5C3.89543 8 3 8.89543 3 10V16C3 17.1046 3.89543 18 5 18H15C16.1046 18 17 17.1046 17 16V10C17 8.89543 16.1046 8 15 8ZM10 14C9.44772 14 9 13.5523 9 13C9 12.4477 9.44772 12 10 12C10.5523 12 11 12.4477 11 13C11 13.5523 10.5523 14 10 14ZM12 8H8V6C8 4.89543 8.89543 4 10 4C11.1046 4 12 4.89543 12 6V8Z"
                                        fill="white" />
                                </svg>
                                <input
                                    type="password"
                                    className="signup-input"
                                    placeholder="Enter your Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="signup-submit-btn" disabled={loading}>
                                {loading ? 'CREATING ACCOUNT...' : 'GET STARTED'}
                            </button>
                        </form>

                        {/* Footer Link */}
                        <p className="signup-footer">
                            Already have an account? <Link to="/login" className="login-link">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
