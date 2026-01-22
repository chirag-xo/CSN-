import { useState, useEffect } from 'react';
import eventService from '../../services/eventService';
import AddInviteesModal from './AddInviteesModal';
import {
    BarChart2,
    Download,
    UserPlus,
    CheckCircle,
    HelpCircle,
    Clock,
    XCircle,
    AlertTriangle,
    User
} from 'lucide-react';
import '../../styles/invitationStats.css';

interface InvitationStatsProps {
    eventId: string;
}

interface Stats {
    total: number;
    invited: number;
    going: number;
    maybe: number;
    declined: number;
    responseRate: number;
    byStatus: {
        invited: any[];
        going: any[];
        maybe: any[];
        declined: any[];
    };
}

export default function InvitationStats({ eventId }: InvitationStatsProps) {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetchStats();
    }, [eventId]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await eventService.getInvitationStats(eventId);
            setStats(response.data);
        } catch (err: any) {
            console.error('Failed to fetch invitation stats:', err);
            setError(err.response?.data?.error?.message || 'Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    const handleExportAttendees = async () => {
        try {
            setExporting(true);
            const response = await eventService.exportAttendees(eventId);

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Get filename from Content-Disposition header or use default
            const contentDisposition = response.headers['content-disposition'];
            const filenameMatch = contentDisposition?.match(/filename="?(.+)"?/);
            link.setAttribute('download', filenameMatch?.[1] || 'attendees.csv');

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error('Failed to export attendees:', err);
            alert('Failed to export attendees. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    const handleInviteSuccess = () => {
        setShowInviteModal(false);
        fetchStats(); // Refresh stats
    };

    const getAllInvitedUserIds = (): string[] => {
        if (!stats) return [];
        return [
            ...stats.byStatus.invited,
            ...stats.byStatus.going,
            ...stats.byStatus.maybe,
            ...stats.byStatus.declined,
        ].map(attendee => attendee.id);
    };

    if (loading) {
        return (
            <div className="stats-loading">
                <div className="loading-spinner-small"></div>
                <p>Loading invitation insights...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="stats-error">
                <p><AlertTriangle size={18} className="error-icon" /> {error}</p>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="invitation-stats">
            <h3 className="stats-title"><BarChart2 className="title-icon" /> Invitation Insights</h3>

            {/* Summary Cards */}
            <div className="stats-summary">
                <div className="stat-card">
                    <div className="stat-number">{stats.total}</div>
                    <div className="stat-label">Total Invited</div>
                </div>
                <div className="stat-card success">
                    <div className="stat-number">{stats.going}</div>
                    <div className="stat-label">Going</div>
                </div>
                <div className="stat-card warning">
                    <div className="stat-number">{stats.maybe}</div>
                    <div className="stat-label">Maybe</div>
                </div>
                <div className="stat-card pending">
                    <div className="stat-number">{stats.invited}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card declined">
                    <div className="stat-number">{stats.declined}</div>
                    <div className="stat-label">Declined</div>
                </div>
            </div>

            {/* Response Rate */}
            <div className="response-rate">
                <div className="rate-header">
                    <span>Response Rate</span>
                    <span className="rate-percentage">{stats.responseRate}%</span>
                </div>
                <div className="rate-bar">
                    <div
                        className="rate-fill"
                        style={{ width: `${stats.responseRate}%` }}
                    ></div>
                </div>
                <p className="rate-note">
                    {stats.total - stats.invited} out of {stats.total} people have responded
                </p>
            </div>

            {/* Action Buttons */}
            <div className="stats-actions">
                <button
                    className="btn-invite"
                    onClick={() => setShowInviteModal(true)}
                >
                    <UserPlus size={18} /> Invite More People
                </button>
                <button
                    className="btn-export"
                    onClick={handleExportAttendees}
                    disabled={exporting}
                >
                    <Download size={18} /> {exporting ? 'Exporting...' : 'Export Attendees'}
                </button>
            </div>

            {/* Attendee Lists */}
            <div className="attendee-lists">
                {/* Going */}
                {stats.byStatus.going.length > 0 && (
                    <div className="attendee-section">
                        <h4 className="section-title success"><CheckCircle size={16} /> GOING ({stats.byStatus.going.length})</h4>
                        <div className="attendee-list">
                            {stats.byStatus.going.map((attendee: any) => (
                                <div key={attendee.id} className="attendee-item">
                                    <div className="attendee-info">
                                        {attendee.profilePhoto ? (
                                            <img src={attendee.profilePhoto} alt="" className="attendee-avatar" />
                                        ) : (
                                            <div className="attendee-avatar-placeholder">
                                                {attendee.firstName[0]}{attendee.lastName[0]}
                                            </div>
                                        )}
                                        <div>
                                            <div className="attendee-name">
                                                {attendee.firstName} {attendee.lastName}
                                                {attendee.role === 'ORGANIZER' && (
                                                    <span className="organizer-badge">Organizer</span>
                                                )}
                                            </div>
                                            {attendee.company && (
                                                <div className="attendee-company">{attendee.company}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="attendee-timestamp">
                                        {new Date(attendee.respondedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Maybe */}
                {stats.byStatus.maybe.length > 0 && (
                    <div className="attendee-section">
                        <h4 className="section-title warning"><HelpCircle size={16} /> MAYBE ({stats.byStatus.maybe.length})</h4>
                        <div className="attendee-list">
                            {stats.byStatus.maybe.map((attendee: any) => (
                                <div key={attendee.id} className="attendee-item">
                                    <div className="attendee-info">
                                        {attendee.profilePhoto ? (
                                            <img src={attendee.profilePhoto} alt="" className="attendee-avatar" />
                                        ) : (
                                            <div className="attendee-avatar-placeholder">
                                                {attendee.firstName[0]}{attendee.lastName[0]}
                                            </div>
                                        )}
                                        <div>
                                            <div className="attendee-name">
                                                {attendee.firstName} {attendee.lastName}
                                            </div>
                                            {attendee.company && (
                                                <div className="attendee-company">{attendee.company}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="attendee-timestamp">
                                        {new Date(attendee.respondedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pending */}
                {stats.byStatus.invited.length > 0 && (
                    <div className="attendee-section">
                        <h4 className="section-title pending"><Clock size={16} /> PENDING ({stats.byStatus.invited.length})</h4>
                        <div className="attendee-list">
                            {stats.byStatus.invited.map((attendee: any) => (
                                <div key={attendee.id} className="attendee-item">
                                    <div className="attendee-info">
                                        {attendee.profilePhoto ? (
                                            <img src={attendee.profilePhoto} alt="" className="attendee-avatar" />
                                        ) : (
                                            <div className="attendee-avatar-placeholder">
                                                {attendee.firstName[0]}{attendee.lastName[0]}
                                            </div>
                                        )}
                                        <div>
                                            <div className="attendee-name">
                                                {attendee.firstName} {attendee.lastName}
                                            </div>
                                            {attendee.company && (
                                                <div className="attendee-company">{attendee.company}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="no-response">No response yet</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Declined */}
                {stats.byStatus.declined.length > 0 && (
                    <div className="attendee-section">
                        <h4 className="section-title declined"><XCircle size={16} /> DECLINED ({stats.byStatus.declined.length})</h4>
                        <div className="attendee-list">
                            {stats.byStatus.declined.map((attendee: any) => (
                                <div key={attendee.id} className="attendee-item">
                                    <div className="attendee-info">
                                        {attendee.profilePhoto ? (
                                            <img src={attendee.profilePhoto} alt="" className="attendee-avatar" />
                                        ) : (
                                            <div className="attendee-avatar-placeholder">
                                                {attendee.firstName[0]}{attendee.lastName[0]}
                                            </div>
                                        )}
                                        <div>
                                            <div className="attendee-name">
                                                {attendee.firstName} {attendee.lastName}
                                            </div>
                                            {attendee.company && (
                                                <div className="attendee-company">{attendee.company}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="attendee-timestamp">
                                        {new Date(attendee.respondedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Invitees Modal */}
            {showInviteModal && (
                <AddInviteesModal
                    eventId={eventId}
                    existingInvitees={getAllInvitedUserIds()}
                    onClose={() => setShowInviteModal(false)}
                    onSuccess={handleInviteSuccess}
                />
            )}
        </div>
    );
}
