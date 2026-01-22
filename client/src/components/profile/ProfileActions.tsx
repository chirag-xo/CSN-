import { useState } from 'react';
import axios from 'axios';
import connectionService from '../../services/connectionService';
import { UserPlus, Share2, MessageCircle, Clock, Star, Check, Loader2 } from 'lucide-react';

interface ViewerContext {
    isOwnProfile: boolean;
    isConnected: boolean;
    connectionPending: boolean;
    hasVouched: boolean;
    canVouch: boolean;
}

import { useNavigate } from 'react-router-dom';

interface ProfileActionsProps {
    userId: string;
    viewerContext: ViewerContext;
    userName: string;
    onVouch: () => void;
    isAuthenticated: boolean;
}

export default function ProfileActions({
    userId,
    viewerContext,
    userName,
    onVouch,
    isAuthenticated,
}: ProfileActionsProps) {
    const navigate = useNavigate();
    const [vouching, setVouching] = useState(false);
    const [vouchError, setVouchError] = useState('');
    const [shareSuccess, setShareSuccess] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [connectError, setConnectError] = useState('');

    // Don't show actions on own profile
    if (viewerContext.isOwnProfile) {
        return null;
    }

    const handleConnect = async () => {
        try {
            setConnecting(true);
            setConnectError('');

            await connectionService.sendRequest(userId);

            // Refresh profile to update viewerContext
            window.location.reload();
        } catch (err: any) {
            console.error('Connect error:', err);
            setConnectError(err.response?.data?.error?.message || 'Failed to send connection request');
        } finally {
            setConnecting(false);
        }
    };

    const handleMessage = () => {
        // TODO: Implement messaging feature
        alert('Messaging feature coming soon!');
    };

    const handleLoginRedirect = () => {
        navigate('/login', { state: { from: window.location.pathname } });
    };

    const handleVouch = async () => {
        try {
            setVouching(true);
            setVouchError('');

            const token = localStorage.getItem('token');
            await axios.post(
                `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/profile/${userId}/vouch`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            onVouch(); // Refresh profile data
        } catch (err: any) {
            console.error('Vouch error:', err);
            setVouchError(err.response?.data?.error?.message || 'Failed to vouch');
        } finally {
            setVouching(false);
        }
    };

    const handleShare = () => {
        const profileUrl = `${window.location.origin}/profile/${userId}`;
        navigator.clipboard.writeText(profileUrl);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
    };

    return (
        <div className="profile-actions-card">
            {/* Connection Actions */}
            <div className="action-buttons">
                {!isAuthenticated ? (
                    <button onClick={handleLoginRedirect} className="action-btn primary">
                        <UserPlus size={18} /> Login to Connect
                    </button>
                ) : viewerContext.isConnected ? (
                    <button onClick={handleMessage} className="action-btn primary">
                        <MessageCircle size={18} /> Message
                    </button>
                ) : viewerContext.connectionPending ? (
                    <button disabled className="action-btn pending">
                        <Clock size={18} /> Request Sent
                    </button>
                ) : (
                    <button
                        onClick={handleConnect}
                        disabled={connecting}
                        className="action-btn primary"
                    >
                        {connecting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" /> Connecting...
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} /> Connect
                            </>
                        )}
                    </button>
                )}

                {/* Vouch Button */}
                {viewerContext.canVouch && (
                    <button
                        onClick={handleVouch}
                        disabled={vouching || viewerContext.hasVouched}
                        className={`action-btn ${viewerContext.hasVouched ? 'vouched' : 'secondary'}`}
                    >
                        {vouching ? (
                            '...'
                        ) : viewerContext.hasVouched ? (
                            <>
                                <Star size={18} fill="currentColor" /> Vouched
                            </>
                        ) : (
                            <>
                                <Star size={18} /> Vouch
                            </>
                        )}
                    </button>
                )}

                {/* Share Button */}
                <button onClick={handleShare} className="action-btn share">
                    {shareSuccess ? (
                        <>
                            <Check size={18} /> Copied!
                        </>
                    ) : (
                        <>
                            <Share2 size={18} /> Share
                        </>
                    )}
                </button>
            </div>

            {vouchError && <p className="error-message">{vouchError}</p>}
            {connectError && <p className="error-message">{connectError}</p>}

            {!viewerContext.canVouch && !viewerContext.hasVouched && (
                <p className="action-hint">
                    Connect to vouch for {userName.split(' ')[0]}
                </p>
            )}
        </div>
    );
}
