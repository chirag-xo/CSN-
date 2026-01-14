import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import eventService, { type Event } from '../services/eventService';
import Breadcrumb from '../components/common/Breadcrumb';
import InvitationStats from '../components/events/InvitationStats';
import '../styles/eventDetails.css';

export default function EventDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rsvping, setRsvping] = useState(false);
    const [selectedRsvp, setSelectedRsvp] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        if (id) {
            fetchEvent();
        }
    }, [id]);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await eventService.getEventById(id!);
            setEvent(response.data);
        } catch (err: any) {
            console.error('Failed to fetch event:', err);
            setError(err.response?.data?.error?.message || 'Failed to load event');
        } finally {
            setLoading(false);
        }
    };

    const handleRsvpSelect = (status: 'GOING' | 'MAYBE' | 'DECLINED') => {
        if (event?.userRsvpStatus === status) return; // Already saved with this status
        setSelectedRsvp(status);
    };

    const handleSendResponse = () => {
        // Always show confirmation modal
        setShowConfirmModal(true);
    };

    const confirmRsvp = async () => {
        if (!selectedRsvp) return;

        try {
            setRsvping(true);
            await eventService.rsvpToEvent(id!, selectedRsvp as 'GOING' | 'MAYBE' | 'DECLINED');
            setShowConfirmModal(false);
            setSelectedRsvp(null);
            fetchEvent(); // Refresh to show updated status
        } catch (err: any) {
            console.error('RSVP error:', err);
            alert('Failed to RSVP. Please try again.');
        } finally {
            setRsvping(false);
        }
    };

    const getRsvpStatusText = () => {
        if (!event?.userRsvpStatus) return null;
        const statusMap: Record<string, string> = {
            GOING: '✓ You\'re going',
            MAYBE: '? You might go',
            DECLINED: '✗ You declined',
        };
        return statusMap[event.userRsvpStatus];
    };

    if (loading) {
        return (
            <div className="event-details-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading event...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="event-details-container">
                <div className="error-state">
                    <p>{error || 'Event not found'}</p>
                    <button className="retry-btn" onClick={() => navigate('/dashboard/home/events')}>
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const eventDate = new Date(event.date);
    const isPastEvent = eventDate < new Date();
    const attendeeCount = event.attendees?.length || 0;
    const goingCount = event.attendees?.filter(a => a.status === 'GOING').length || 0;

    return (
        <div className="event-details-container">
            <Breadcrumb items={[{ label: 'Events', path: '/dashboard/home/events' }, { label: event.title }]} />

            <div className="event-details-content">
                {/* Header */}
                <div className="event-header">
                    <div className="event-header-top">
                        <div className="event-type-badge" style={{
                            backgroundColor: getTypeColor(event.type)
                        }}>
                            {getTypeIcon(event.type)} {event.type.replace('_', ' ')}
                        </div>
                        {isPastEvent && <span className="past-event-badge">Past Event</span>}
                    </div>

                    <h1 className="event-title">{event.title}</h1>

                    <div className="event-meta-row">
                        <div className="meta-item">
                            <span className="icon">📅</span>
                            <span>{eventDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>

                        <div className="meta-item">
                            <span className="icon">⏰</span>
                            <span>{eventDate.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                            })}</span>
                        </div>

                        {event.isVirtual ? (
                            <div className="meta-item">
                                <span className="icon">💻</span>
                                <span>Virtual Event</span>
                            </div>
                        ) : event.location && (
                            <div className="meta-item">
                                <span className="icon">📍</span>
                                <span>{event.location}</span>
                            </div>
                        )}
                    </div>

                    <div className="organizer-info">
                        <img
                            src={
                                event.creator.profilePhoto
                                    ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${event.creator.profilePhoto}`
                                    : `https://ui-avatars.com/api/?name=${event.creator.firstName}+${event.creator.lastName}&background=6D28D9&color=fff`
                            }
                            alt={`${event.creator.firstName} ${event.creator.lastName}`}
                            className="organizer-avatar"
                        />
                        <div className="organizer-details">
                            <div className="organizer-label">Organized by</div>
                            <Link
                                to={`/profile/${event.creator.id}`}
                                className="organizer-name"
                            >
                                {event.creator.firstName} {event.creator.lastName}
                            </Link>
                            {event.creator.company && (
                                <div className="organizer-company">{event.creator.company}</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="event-section">
                    <h2>About  this Event</h2>
                    <p className="event-description">{event.description}</p>
                </div>

                {/* Virtual Link */}
                {event.isVirtual && event.virtualLink && (
                    <div className="event-section virtual-link-section">
                        <h2>Join Online</h2>
                        <a
                            href={event.virtualLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="virtual-link-btn"
                        >
                            🔗 Join Virtual Event
                        </a>
                    </div>
                )}

                {/* Chapter */}
                {event.chapter && (
                    <div className="event-section">
                        <h2>Chapter</h2>
                        <div className="chapter-badge">{event.chapter.name}</div>
                    </div>
                )}

                {/* Attendees */}
                <div className="event-section">
                    <h2>Attendees ({goingCount} going{attendeeCount > goingCount ? `, ${attendeeCount - goingCount} maybe` : ''})</h2>

                    {event.attendees && event.attendees.length > 0 ? (
                        <div className="attendees-grid">
                            {event.attendees
                                .filter(a => a.status === 'GOING')
                                .map((attendee) => (
                                    <Link
                                        key={attendee.id}
                                        to={`/profile/${attendee.user.id}`}
                                        className="attendee-card"
                                    >
                                        <img
                                            src={
                                                attendee.user.profilePhoto
                                                    ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${attendee.user.profilePhoto}`
                                                    : `https://ui-avatars.com/api/?name=${attendee.user.firstName}+${attendee.user.lastName}&background=6D28D9&color=fff`
                                            }
                                            alt={`${attendee.user.firstName} ${attendee.user.lastName}`}
                                            className="attendee-avatar"
                                        />
                                        <div className="attendee-info">
                                            <div className="attendee-name">
                                                {attendee.user.firstName} {attendee.user.lastName}
                                            </div>
                                            {attendee.user.company && (
                                                <div className="attendee-company">{attendee.user.company}</div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    ) : (
                        <p className="no-attendees">No attendees yet. Be the first to RSVP!</p>
                    )}
                </div>

                {/* Invitation Stats - For organizers of private events only */}
                {event.isOrganizer && !event.isPublic && (
                    <InvitationStats eventId={event.id} />
                )}

                {/* RSVP Section */}
                {!isPastEvent && (
                    <div className="rsvp-section">
                        {getRsvpStatusText() && (
                            <div className="current-rsvp">{getRsvpStatusText()}</div>
                        )}

                        <div className="rsvp-buttons">
                            <button
                                className={`rsvp-btn ${event.userRsvpStatus === 'GOING' ? 'active' :
                                        selectedRsvp === 'GOING' ? 'selected' : ''
                                    }`}
                                onClick={() => handleRsvpSelect('GOING')}
                                disabled={rsvping || event.userRsvpStatus === 'GOING'}
                            >
                                ✓ Going
                            </button>
                            <button
                                className={`rsvp-btn ${event.userRsvpStatus === 'MAYBE' ? 'active' :
                                        selectedRsvp === 'MAYBE' ? 'selected' : ''
                                    }`}
                                onClick={() => handleRsvpSelect('MAYBE')}
                                disabled={rsvping || event.userRsvpStatus === 'MAYBE'}
                            >
                                ? Maybe
                            </button>
                            <button
                                className={`rsvp-btn decline ${event.userRsvpStatus === 'DECLINED' ? 'active' :
                                        selectedRsvp === 'DECLINED' ? 'selected' : ''
                                    }`}
                                onClick={() => handleRsvpSelect('DECLINED')}
                                disabled={rsvping || event.userRsvpStatus === 'DECLINED'}
                            >
                                ✗ Can't Go
                            </button>
                        </div>

                        {/* Send Response Button */}
                        {selectedRsvp && (
                            <button
                                className="send-response-btn"
                                onClick={handleSendResponse}
                                disabled={rsvping}
                            >
                                {rsvping ? 'Sending...' : 'Send Response'}
                            </button>
                        )}

                        {/* Confirmation Modal */}
                        {showConfirmModal && (
                            <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
                                <div className="modal-content rsvp-confirm-modal" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <h3>Confirm Your Response</h3>
                                        <button className="modal-close" onClick={() => setShowConfirmModal(false)}>✕</button>
                                    </div>
                                    <div className="modal-body">
                                        {selectedRsvp === 'DECLINED' ? (
                                            <>
                                                <div className="warning-icon">⚠️</div>
                                                <p className="warning-text">
                                                    You won't be able to change your response after declining.
                                                </p>
                                                <p>Are you sure you want to decline this event?</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="info-icon">ℹ️</div>
                                                <p>
                                                    {selectedRsvp === 'GOING'
                                                        ? 'Confirm that you will attend this event?'
                                                        : 'Confirm that you might attend this event?'}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn-cancel" onClick={() => setShowConfirmModal(false)}>
                                            Cancel
                                        </button>
                                        <button className="btn-primary" onClick={confirmRsvp} disabled={rsvping}>
                                            {rsvping ? 'Sending...' :
                                                selectedRsvp === 'DECLINED' ? 'Yes, Decline' :
                                                    selectedRsvp === 'GOING' ? 'Yes, I\'m Going' :
                                                        'Yes, Maybe'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper functions
function getTypeColor(type: string) {
    const colors: Record<string, string> = {
        NETWORKING: '#059669',
        WORKSHOP: '#DC2626',
        SOCIAL: '#EA580C',
        EDUCATIONAL: '#2563EB',
        COMMUNITY: '#6D28D9',
        ONE_TO_ONE: '#7C3AED',
    };
    return colors[type] || '#6B7280';
}

function getTypeIcon(type: string) {
    const icons: Record<string, string> = {
        NETWORKING: '🤝',
        WORKSHOP: '🛠️',
        SOCIAL: '🎉',
        EDUCATIONAL: '📚',
        COMMUNITY: '🏘️',
        ONE_TO_ONE: '☕',
    };
    return icons[type] || '📅';
}
