import { useState, useEffect } from 'react';
import connectionService, { type Connection } from '../../services/connectionService';
import eventService from '../../services/eventService';
import '../../styles/addInviteesModal.css';

interface AddInviteesModalProps {
    eventId: string;
    existingInvitees: string[]; // User IDs already invited
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddInviteesModal({ eventId, existingInvitees, onClose, onSuccess }: AddInviteesModalProps) {
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            setLoading(true);
            const connectionsData = await connectionService.getConnections();
            setConnections(connectionsData.data || []);
        } catch (err: any) {
            console.error('Failed to fetch connections:', err);
            setError('Failed to load connections');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (userId: string) => {
        // Don't allow selecting already invited users
        if (existingInvitees.includes(userId)) return;

        setSelectedIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = async () => {
        if (selectedIds.length === 0) {
            setError('Please select at least one person to invite');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            await eventService.addInvitees(eventId, selectedIds);
            onSuccess();
        } catch (err: any) {
            console.error('Failed to add invitees:', err);
            setError(err.response?.data?.error?.message || 'Failed to add invitees');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content add-invitees-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🔒 Invite More People</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner-small"></div>
                            <p>Loading connections...</p>
                        </div>
                    ) : connections.length === 0 ? (
                        <p className="empty-message">You don't have any connections yet.</p>
                    ) : (
                        <>
                            <p className="instruction">Select connections to invite:</p>
                            {error && <div className="error-message">{error}</div>}

                            <div className="connections-list">
                                {connections.map((connection) => {
                                    const isAlreadyInvited = existingInvitees.includes(connection.user.id);
                                    return (
                                        <div
                                            key={connection.user.id}
                                            className={`connection-item ${isAlreadyInvited ? 'disabled' : ''} ${selectedIds.includes(connection.user.id) ? 'selected' : ''}`}
                                            onClick={() => handleToggle(connection.user.id)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isAlreadyInvited || selectedIds.includes(connection.user.id)}
                                                disabled={isAlreadyInvited}
                                                onChange={() => { }}
                                            />
                                            <div className="connection-info">
                                                <div className="connection-name">
                                                    {connection.user.firstName} {connection.user.lastName}
                                                    {isAlreadyInvited && <span className="already-invited">Already invited</span>}
                                                </div>
                                                {connection.user.company && (
                                                    <div className="connection-company">{connection.user.company}</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleSubmit}
                        disabled={submitting || loading || selectedIds.length === 0}
                    >
                        {submitting ? 'Sending...' : `Send Invites (${selectedIds.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
}
