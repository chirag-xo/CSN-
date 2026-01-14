import { Link } from 'react-router-dom';
import { type Event } from '../../services/eventService';

interface EventCardProps {
    event: Event;
    onRsvp?: (eventId: string, status: 'GOING' | 'MAYBE' | 'DECLINED') => void;
}

export default function EventCard({ event, onRsvp }: EventCardProps) {
    const eventDate = new Date(event.date);
    const attendeeCount = event._count?.attendees || 0;

    // Event type colors
    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            NETWORKING: '#059669',
            WORKSHOP: '#DC2626',
            SOCIAL: '#EA580C',
            EDUCATIONAL: '#2563EB',
            COMMUNITY: '#6D28D9',
            ONE_TO_ONE: '#7C3AED',
        };
        return colors[type] || '#6B7280';
    };

    const getTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            NETWORKING: '🤝',
            WORKSHOP: '🛠️',
            SOCIAL: '🎉',
            EDUCATIONAL: '📚',
            COMMUNITY: '🏘️',
            ONE_TO_ONE: '☕',
        };
        return icons[type] || '📅';
    };

    const getRsvpButton = () => {
        if (!onRsvp) return null;

        if (event.userRsvpStatus === 'GOING') {
            return (
                <button className="rsvp-btn going" disabled>
                    ✓ Going
                </button>
            );
        }

        if (event.userRsvpStatus === 'MAYBE') {
            return (
                <button className="rsvp-btn maybe" disabled>
                    ? Maybe
                </button>
            );
        }

        return (
            <div className="rsvp-actions">
                <button
                    className="rsvp-btn primary"
                    onClick={(e) => {
                        e.preventDefault();
                        onRsvp(event.id, 'GOING');
                    }}
                >
                    Going
                </button>
                <button
                    className="rsvp-btn secondary"
                    onClick={(e) => {
                        e.preventDefault();
                        onRsvp(event.id, 'MAYBE');
                    }}
                >
                    Maybe
                </button>
            </div>
        );
    };

    return (
        <Link to={`/dashboard/home/events/${event.id}`} className="event-card">
            <div
                className="event-type-badge"
                style={{ backgroundColor: getTypeColor(event.type) }}
            >
                {getTypeIcon(event.type)} {event.type.replace('_', ' ')}
            </div>

            <div className="event-date-box">
                <div className="day">{eventDate.getDate()}</div>
                <div className="month">
                    {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                </div>
            </div>

            <div className="event-content">
                <h3 className="event-title">{event.title}</h3>

                <p className="event-description">
                    {event.description.length > 100
                        ? `${event.description.substring(0, 100)}...`
                        : event.description}
                </p>

                <div className="event-meta">
                    <div className="meta-item">
                        <span className="icon">⏰</span>
                        <span>
                            {eventDate.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>

                    {event.isVirtual ? (
                        <div className="meta-item">
                            <span className="icon">💻</span>
                            <span>Virtual Event</span>
                        </div>
                    ) : event.location ? (
                        <div className="meta-item">
                            <span className="icon">📍</span>
                            <span>{event.location}</span>
                        </div>
                    ) : null}

                    <div className="meta-item">
                        <span className="icon">👥</span>
                        <span>{attendeeCount} attending</span>
                    </div>
                </div>

                {event.chapter && (
                    <div className="event-chapter">
                        {event.chapter.name}
                    </div>
                )}

                <div className="event-organizer">
                    <img
                        src={
                            event.creator.profilePhoto
                                ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${event.creator.profilePhoto
                                }`
                                : `https://ui-avatars.com/api/?name=${event.creator.firstName}+${event.creator.lastName}&background=6D28D9&color=fff`
                        }
                        alt={`${event.creator.firstName} ${event.creator.lastName}`}
                        className="organizer-avatar"
                    />
                    <span className="organizer-name">
                        by {event.creator.firstName} {event.creator.lastName}
                    </span>
                </div>
            </div>

            {getRsvpButton()}
        </Link>
    );
}
