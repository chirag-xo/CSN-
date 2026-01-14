import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/upcomingEvents.css';

interface Event {
    id: string;
    title: string;
    date: string;
    endDate?: string;
    type: string;
    location?: string;
    virtualLink?: string;
    isVirtual: boolean;
    rsvpStatus: 'GOING' | 'MAYBE' | 'INVITED' | 'NOT_GOING';
    creatorName: string;
}

interface UpcomingEventsProps {
    events: Event[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const isToday = date.toDateString() === today.toDateString();
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        const timeStr = date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });

        if (isToday) return `Today at ${timeStr}`;
        if (isTomorrow) return `Tomorrow at ${timeStr}`;

        return date.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            GOING: { label: 'Going', color: '#059669', icon: '✓' },
            MAYBE: { label: 'Maybe', color: '#F59E0B', icon: '?' },
            INVITED: { label: 'Invited', color: '#6D28D9', icon: '✉' },
            NOT_GOING: { label: 'Not Going', color: '#DC2626', icon: '✕' },
        };
        return badges[status as keyof typeof badges] || badges.INVITED;
    };

    const getTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            NETWORKING: '🤝',
            WORKSHOP: '🎓',
            SOCIAL: '🎉',
            EDUCATIONAL: '📚',
            COMMUNITY: '🏘️',
            ONE_TO_ONE: '👥',
        };
        return icons[type] || '📅';
    };

    return (
        <div className="upcoming-events-section">
            <div className="events-header">
                <h3 className="section-title">Upcoming Meetings & Events</h3>
                <div className="events-actions">
                    <button
                        className="create-event-btn"
                        onClick={() => navigate('/dashboard/home/events')}
                    >
                        + Create Event
                    </button>
                    <button
                        className="view-all-btn"
                        onClick={() => navigate('/dashboard/home/events')}
                    >
                        View All →
                    </button>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="empty-events-state">
                    <div className="empty-icon">📅</div>
                    <p className="empty-message">No upcoming events scheduled</p>
                    <button
                        className="browse-events-btn"
                        onClick={() => navigate('/dashboard/home/events')}
                    >
                        Browse Events
                    </button>
                </div>
            ) : (
                <div className="events-grid">
                    {events.map((event) => {
                        const statusBadge = getStatusBadge(event.rsvpStatus);
                        return (
                            <div key={event.id} className="event-card-compact">
                                <div className="event-card-header">
                                    <div className="event-type-badge">
                                        <span className="event-type-icon">{getTypeIcon(event.type)}</span>
                                        <span className="event-type-label">{event.type}</span>
                                    </div>
                                    <div
                                        className="rsvp-badge"
                                        style={{ backgroundColor: `${statusBadge.color}15`, color: statusBadge.color }}
                                    >
                                        <span className="rsvp-icon">{statusBadge.icon}</span>
                                        {statusBadge.label}
                                    </div>
                                </div>

                                <h4 className="event-card-title">{event.title}</h4>

                                <div className="event-card-details">
                                    <div className="event-detail-row">
                                        <span className="detail-icon">📅</span>
                                        <span className="detail-text">{formatDate(event.date)}</span>
                                    </div>
                                    <div className="event-detail-row">
                                        <span className="detail-icon">{event.isVirtual ? '💻' : '📍'}</span>
                                        <span className="detail-text">
                                            {event.isVirtual ? 'Virtual Event' : (event.location || 'TBD')}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="view-details-btn"
                                    onClick={() => navigate(`/event/${event.id}`)}
                                >
                                    View Details →
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
