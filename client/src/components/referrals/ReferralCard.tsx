import { useState } from 'react';
import { type Referral } from '../../services/referralService';
import {
    ChevronDown,
    ChevronUp,
    Check,
    X,
    Briefcase,
    Handshake,
    LifeBuoy,
    Clock,
    CheckCircle2,
    XCircle,
    User,
    Mail,
    Phone,
    Calendar,
    FileText
} from 'lucide-react';
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
            BUSINESS: { icon: Briefcase, label: 'Business', class: 'business' },
            INTRO: { icon: Handshake, label: 'Intro', class: 'intro' },
            SUPPORT: { icon: LifeBuoy, label: 'Support', class: 'support' },
        };
        const config = typeConfig[referral.type];
        const Icon = config.icon;

        return (
            <span className={`type-badge ${config.class}`}>
                <Icon size={14} className="inline-icon" /> {config.label}
            </span>
        );
    };

    const getStatusBadge = () => {
        const statusConfig = {
            PENDING: { icon: Clock, label: 'Pending', class: 'pending' },
            CONVERTED: { icon: CheckCircle2, label: 'Converted', class: 'converted' },
            CLOSED: { icon: XCircle, label: 'Closed', class: 'closed' },
        };
        const config = statusConfig[referral.status];
        const Icon = config.icon;

        return (
            <span className={`status-badge ${config.class}`}>
                <Icon size={14} className="inline-icon" /> {config.label}
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
                                    {referral.contactName && (
                                        <p className="flex items-center gap-2">
                                            <User size={14} className="text-gray-500" /> {referral.contactName}
                                        </p>
                                    )}
                                    {referral.contactEmail && (
                                        <p className="flex items-center gap-2">
                                            <Mail size={14} className="text-gray-500" /> {referral.contactEmail}
                                        </p>
                                    )}
                                    {referral.contactPhone && (
                                        <p className="flex items-center gap-2">
                                            <Phone size={14} className="text-gray-500" /> {referral.contactPhone}
                                        </p>
                                    )}
                                </div>
                            )}

                            {referral.notes && (
                                <div className="notes">
                                    <strong className="flex items-center gap-2 mb-1">
                                        <FileText size={14} /> Notes:
                                    </strong>
                                    {referral.notes}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="card-footer">
                    <span className="timestamp flex items-center gap-2">
                        <Calendar size={14} /> {formatDate(referral.createdAt)}
                    </span>
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
                    <div className="read-only-badge flex items-center gap-2 justify-center">
                        {referral.status === 'CONVERTED' ? (
                            <>
                                <CheckCircle2 size={16} className="text-green-600" />
                                <span>This referral was converted</span>
                            </>
                        ) : (
                            <>
                                <XCircle size={16} className="text-red-500" />
                                <span>This referral was closed</span>
                            </>
                        )}
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
                            <div className="confirm-icon flex justify-center">
                                {selectedStatus === 'CONVERTED' ? (
                                    <CheckCircle2 size={48} className="text-green-600" />
                                ) : (
                                    <XCircle size={48} className="text-red-500" />
                                )}
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
