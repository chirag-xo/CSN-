import { useState } from 'react';
import { type Referral } from '../../services/referralService';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import '../../styles/referrals.css';

interface ReferralCardProps {
    referral: Referral;
    isReceived: boolean;
    onStatusUpdate: (referralId: string, status: 'CONVERTED' | 'CLOSED') => void;
}

export default function ReferralCard({ referral, isReceived, onStatusUpdate }: ReferralCardProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<'CONVERTED' | 'CLOSED' | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const user = isReceived ? referral.fromUser : referral.toUser;
    const canUpdate = referral.status === 'PENDING' && isReceived;

    const getTypeBadge = () => {
        const typeConfig = {
            BUSINESS: { emoji: '💼', label: 'Business', class: 'business' },
            INTRO: { emoji: '🤝', label: 'Intro', class: 'intro' },
            SUPPORT: { emoji: '🆘', label: 'Support', class: 'support' },
        };
        const config = typeConfig[referral.type];
        return (
            <span className={`type-badge ${config.class}`}>
                {config.emoji} {config.label}
            </span>
        );
    };

    const getStatusBadge = () => {
        const statusConfig = {
            PENDING: { icon: '🟡', label: 'Pending', class: 'pending' },
            CONVERTED: { icon: '✅', label: 'Converted', class: 'converted' },
            CLOSED: { icon: '❌', label: 'Closed', class: 'closed' },
        };
        const config = statusConfig[referral.status];
        return (
            <span className={`status-badge ${config.class}`}>
                {config.icon} {config.label}
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
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <>
            <div className="referral-card">
                {/* Header - Horizontal Layout */}
                <div className="card-header">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div className="user-details">
                            <h4>{user?.firstName} {user?.lastName}</h4>
                            {(user?.position || user?.company) && (
                                <p className="company">
                                    {user?.position}{user?.position && user?.company && ' @ '}{user?.company}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="badges">
                        {getTypeBadge()}
                        {getStatusBadge()}
                        {referral.businessValue && (
                            <span className="value-display">
                                ₹{referral.businessValue.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Body - Description Preview */}
                <div className="card-body">
                    <p className={`description ${!isExpanded ? 'truncated' : ''}`}>
                        {referral.description}
                    </p>

                    {/* Expanded Details */}
                    {isExpanded && (
                        <>
                            {(referral.contactName || referral.contactEmail || referral.contactPhone) && (
                                <div className="contact-details">
                                    <h5>Contact Information:</h5>
                                    {referral.contactName && <p>👤 {referral.contactName}</p>}
                                    {referral.contactEmail && <p>📧 {referral.contactEmail}</p>}
                                    {referral.contactPhone && <p>📞 {referral.contactPhone}</p>}
                                </div>
                            )}

                            {referral.notes && (
                                <div className="notes">
                                    <strong>Notes:</strong> {referral.notes}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="card-footer">
                    <span className="timestamp">📅 {formatDate(referral.createdAt)}</span>
                    <button
                        className="expand-btn"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? (
                            <>
                                Less details <ChevronUp size={14} />
                            </>
                        ) : (
                            <>
                                More details <ChevronDown size={14} />
                            </>
                        )}
                    </button>
                </div>

                {/* Status Update Actions - Only for PENDING received referrals */}
                {canUpdate && (
                    <div className="card-actions">
                        <button
                            className="btn-converted"
                            onClick={() => handleUpdateClick('CONVERTED')}
                        >
                            <Check size={16} />
                            Mark Converted
                        </button>
                        <button
                            className="btn-closed"
                            onClick={() => handleUpdateClick('CLOSED')}
                        >
                            <X size={16} />
                            Mark Closed
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
