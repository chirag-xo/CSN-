import { useState, useEffect } from 'react';
import connectionService, { type Connection } from '../../services/connectionService';
import referralService, { type CreateReferralData } from '../../services/referralService';
import '../../styles/referrals.css';

interface SendReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function SendReferralModal({ isOpen, onClose, onSuccess }: SendReferralModalProps) {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<CreateReferralData>({
        toUserId: '',
        type: 'BUSINESS',
        description: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        businessValue: undefined,
    });

    useEffect(() => {
        if (isOpen) {
            fetchConnections();
        }
    }, [isOpen]);

    const fetchConnections = async () => {
        try {
            setLoading(true);
            const response = await connectionService.getConnections();
            setConnections(response.data);
        } catch (err) {
            console.error('Failed to fetch connections:', err);
            setError('Failed to load connections');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.toUserId) {
            setError('Please select a connection');
            return;
        }
        if (!formData.description.trim()) {
            setError('Description is required');
            return;
        }
        if (formData.contactEmail && !/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
            setError('Invalid email format');
            return;
        }

        try {
            setSubmitting(true);
            await referralService.createReferral(formData);
            onSuccess();
            handleClose();
        } catch (err: any) {
            console.error('Failed to create referral:', err);
            // Handle specific error codes
            const errorMessage = err.response?.data?.error?.message || 'Failed to send referral';
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            toUserId: '',
            type: 'BUSINESS',
            description: '',
            contactName: '',
            contactEmail: '',
            contactPhone: '',
            businessValue: undefined,
        });
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content send-referral-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Send Referral</h3>
                    <button className="modal-close" onClick={handleClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && <div className="error-message">{error}</div>}

                        {/* Connection Selector */}
                        <div className="form-group">
                            <label>Refer to: *</label>
                            {loading ? (
                                <div>Loading connections...</div>
                            ) : (connections?.length ?? 0) === 0 ? (
                                <div className="no-connections">
                                    <p>You don't have any connections yet.</p>
                                    <p>Connect with people first to send referrals.</p>
                                </div>
                            ) : (
                                <select
                                    value={formData.toUserId}
                                    onChange={(e) => setFormData({ ...formData, toUserId: e.target.value })}
                                    required
                                >
                                    <option value="">Select a connection</option>
                                    {connections.map((conn) => (
                                        <option key={conn.user.id} value={conn.user.id}>
                                            {conn.user.firstName} {conn.user.lastName} {conn.user.company ? `- ${conn.user.company}` : ''}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Referral Type */}
                        <div className="form-group">
                            <label>Referral Type: *</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'BUSINESS' | 'INTRO' | 'SUPPORT' })}
                                required
                            >
                                <option value="BUSINESS">💼 Business</option>
                                <option value="INTRO">🤝 Introduction</option>
                                <option value="SUPPORT">🆘 Support</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label>Description: *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the referral opportunity..."
                                rows={4}
                                required
                            />
                        </div>

                        {/* Contact Name */}
                        <div className="form-group">
                            <label>Contact Name:</label>
                            <input
                                type="text"
                                value={formData.contactName}
                                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                placeholder="Optional"
                            />
                        </div>

                        {/* Contact Email */}
                        <div className="form-group">
                            <label>Contact Email:</label>
                            <input
                                type="email"
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                placeholder="optional@example.com"
                            />
                        </div>

                        {/* Contact Phone */}
                        <div className="form-group">
                            <label>Contact Phone:</label>
                            <input
                                type="tel"
                                value={formData.contactPhone}
                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                placeholder="+91 1234567890"
                            />
                        </div>

                        {/* Business Value */}
                        <div className="form-group">
                            <label>Estimated Value (₹):</label>
                            <input
                                type="number"
                                value={formData.businessValue || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    businessValue: e.target.value ? parseFloat(e.target.value) : undefined
                                })}
                                placeholder="Optional"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-cancel" onClick={handleClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={submitting || loading || (connections?.length ?? 0) === 0}
                        >
                            {submitting ? 'Sending...' : 'Send Referral'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
