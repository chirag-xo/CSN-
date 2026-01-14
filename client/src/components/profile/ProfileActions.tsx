import { useState } from 'react';
import axios from 'axios';
import connectionService from '../../services/connectionService';

interface ViewerContext {
    isOwnProfile: boolean;
    isConnected: boolean;
    connectionPending: boolean;
    hasVouched: boolean;
    canVouch: boolean;
}

interface ProfileActionsProps {
    userId: string;
    viewerContext: ViewerContext;
    userName: string;
    onVouch: () => void;
}

export default function ProfileActions({
    userId,
    viewerContext,
    userName,
    onVouch,
}: ProfileActionsProps) {
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
                {viewerContext.isConnected ? (
                    <button onClick={handleMessage} className="action-btn primary">
                        💬 Message
                    </button>
                ) : viewerContext.connectionPending ? (
                    <button disabled className="action-btn pending">
                        ⏳ Request Sent
                    </button>
                ) : (
                    <button
                        onClick={handleConnect}
                        disabled={connecting}
                        className="action-btn primary"
                    >
                        {connecting ? '⏳ Connecting...' : '👋 Connect'}
                    </button>
                )}

                {/* Vouch Button */}
                {viewerContext.canVouch && (
                    <button
                        onClick={handleVouch}
                        disabled={vouching || viewerContext.hasVouched}
                        className={`action-btn ${viewerContext.hasVouched ? 'vouched' : 'secondary'}`}
                    >
                        {vouching ? '...' : viewerContext.hasVouched ? '⭐ Vouched' : '⭐ Vouch'}
                    </button>
                )}

                {/* Share Button */}
                <button onClick={handleShare} className="action-btn share">
                    {shareSuccess ? '✓ Copied!' : '📤 Share'}
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
