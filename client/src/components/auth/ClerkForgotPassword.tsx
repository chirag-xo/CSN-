import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';
import '../../styles/login.css'; // Reusing login styles for consistency

export default function ClerkForgotPassword() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'request' | 'reset'>('request');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    // Step 1: Request Password Reset Code
    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: email,
            });
            setStep('reset');
        } catch (err: any) {
            console.error(err);
            setError(err.errors?.[0]?.message || 'Failed to send reset code. Please check your email.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify Code and Set New Password
    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                navigate('/dashboard/home');
            } else {
                console.log(result);
                setError("Reset failed. Please try again.");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.errors?.[0]?.message || 'Failed to reset password. Please check the code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="login-page">
            {/* Back Button */}
            <Link to="/login" className="back-button">
                <img src="/back.jpg" alt="Back to Login" />
            </Link>

            <div className="login-container">
                {/* Left Column: Form */}
                <div className="login-form-section">
                    <div className="form-wrapper">
                        {/* Header */}
                        <div className="login-header">
                            <h1 className="login-title">Reset Password</h1>
                            <p className="login-subtitle">
                                {step === 'request'
                                    ? "Enter your email to receive a reset code"
                                    : "Enter the code and your new password"}
                            </p>
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

                        {/* Request Step Form */}
                        {step === 'request' && (
                            <form className="login-form" onSubmit={handleRequest}>
                                <div className="input-group">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="white" />
                                        <path d="M10 12.5C5.58172 12.5 2 14.7386 2 17.5V20H18V17.5C18 14.7386 14.4183 12.5 10 12.5Z" fill="white" />
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

                                <button type="submit" className="login-submit-btn" disabled={loading}>
                                    {loading ? 'SENDING...' : 'SEND RESET CODE'}
                                </button>
                            </form>
                        )}

                        {/* Reset Step Form */}
                        {step === 'reset' && (
                            <form className="login-form" onSubmit={handleReset}>
                                {/* Code Input */}
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="login-input"
                                        placeholder="Enter Verification Code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                        style={{ paddingLeft: '20px' }} // Adjusted padding since no icon
                                    />
                                </div>

                                {/* New Password Input */}
                                <div className="input-group">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.8333 9.16667H15V6.66667C15 3.90833 12.7583 1.66667 10 1.66667C7.24167 1.66667 5 3.90833 5 6.66667V9.16667H4.16667C3.25 9.16667 2.5 9.91667 2.5 10.8333V17.5C2.5 18.4167 3.25 19.1667 4.16667 19.1667H15.8333C16.75 19.1667 17.5 18.4167 17.5 17.5V10.8333C17.5 9.91667 16.75 9.16667 15.8333 9.16667ZM10 15C9.08333 15 8.33333 14.25 8.33333 13.3333C8.33333 12.4167 9.08333 11.6667 10 11.6667C10.9167 11.6667 11.6667 12.4167 11.6667 13.3333C11.6667 14.25 10.9167 15 10 15ZM12.9167 9.16667H7.08333V6.66667C7.08333 5.05833 8.39167 3.75 10 3.75C11.6083 3.75 12.9167 5.05833 12.9167 6.66667V9.16667Z" fill="white" />
                                    </svg>
                                    <input
                                        type="password"
                                        className="login-input"
                                        placeholder="Enter New Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="login-submit-btn" disabled={loading}>
                                    {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Right Column: Image */}
                <div className="login-image-section">
                    <img src="/login.png" alt="Illustration" className="earth-image" />
                </div>
            </div>
        </div>
    );
}
