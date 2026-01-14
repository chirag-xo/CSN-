import { useState } from 'react';
import { type Referral } from '../../services/referralService';
import '../../styles/referrals.css';

interface ReferralCardProps {
    referral: Referral;
    isReceived: boolean;
    onStatusUpdate: (referralId: string, status: 'CONVERTED' | 'CLOSED') => void;
}

export default function ReferralCard({ referral, isReceived, onStatusUpdate }: ReferralCardProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<'CONVERTED' | 'CLOSED' | null>(null);

    const user = isReceived ? referral.fromUser : referral.toUser;
    const canUpdate = referral.status === 'PENDING' && isReceived;

    const getTypeBadge = () => {
        const icons = {
            BUSINESS: '💼',
            INTRO: '🤝',
            SUPPORT: '🆘',
        };
        return (
            <span className={`type-badge ${referral.type.toLowerCase()}`}>
                {icons[referral.type]} {referral.type}
            </span>
        );
    };

    const getStatusBadge = () => {
        const config = {
            PENDING: { icon: '🟡', class: 'pending', label: 'Pending' },
            CONVERTED: { icon: '✅', class: 'converted', label: 'Converted' },
            CLOSED: { icon: '❌', class: 'closed', label: 'Closed' },
        };
        const { icon, class: className, label } = config[referral.status];
        return (
            <span className={`status-badge ${className}`}>
                {icon} {label}
            </span>
        );
    };

    const handleUpdateClick = (status: 'CONVERTED' | 'CLOSED') => {
        setSelectedStatus(status);
        setShowConfirm(true);
    };

    const confirmUpdate = () => {
        if (selectedStatus) {
            onStatusUpdate(referral.id, selectedStatus);
            setShowConfirm(false);
            setSelectedStatus(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            <div className="referral-card">
                <div className="card-header">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div className="user-details">
                            <h4>{user?.firstName} {user?.lastName}</h4>
                            {user?.company && <p className="company">{user.company}</p>}
                            {user?.position && <p className="position">{user.position}</p>}
                        </div>
                    </div>
                    <div className="badges">
                        {getTypeBadge()}
                        {getStatusBadge()}
                    </div>
                </div>

                <div className="card-body">
                    <p className="description">{referral.description}</p>

                    {(referral.contactName || referral.contactEmail || referral.contactPhone) && (
                        <div className="contact-details">
                            <h5>Contact Information:</h5>
                            {referral.contactName && <p>👤 {referral.contactName}</p>}
                            {referral.contactEmail && <p>📧 {referral.contactEmail}</p>}
                            {referral.contactPhone && <p>📞 {referral.contactPhone}</p>}
                        </div>
                    )}

                    {referral.businessValue && (
                        <div className="business-value">
                            💰 Est. Value: ₹{referral.businessValue.toLocaleString()}
                        </div>
                    )}

                    {referral.notes && (
                        <div className="notes">
                            <strong>Notes:</strong> {referral.notes}
                        </div>
                    )}

                    <div className="card-footer">
                        <span className="timestamp">📅 {formatDate(referral.createdAt)}</span>
                    </div>
                </div>

                {/* Status Locking: Show actions only for PENDING received referrals */}
                {canUpdate && (
                    <div className="card-actions">
                        <button
                            className="btn-converted"
                            onClick={() => handleUpdateClick('CONVERTED')}
                        >
                            ✅ Mark Converted
                        </button>
                        <button
                            className="btn-closed"
                            onClick={() => handleUpdateClick('CLOSED')}
                        >
                            ❌ Mark Closed
                        </button>
                    </div>
                )}

                {/* Read-only state for non-pending */}
                {!canUpdate && referral.status !== 'PENDING' && (
                    <div className="read-only-badge">
                        {referral.status === 'CONVERTED' ? '✅ This referral was converted' : '❌ This referral was closed'}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
                    <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Status Update</h3>
                            <button className="modal-close" onClick={() => setShowConfirm(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="confirm-icon">
                                {selectedStatus === 'CONVERTED' ? '✅' : '❌'}
                            </div>
                            <p>
                                {selectedStatus === 'CONVERTED'
                                    ? 'Did this referral result in business?'
                                    : 'Mark this referral as closed?'}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowConfirm(false)}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={confirmUpdate}>
                                {selectedStatus === 'CONVERTED' ? 'Yes, Converted' : 'Yes, Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
