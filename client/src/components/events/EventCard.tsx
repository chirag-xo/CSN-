import { Link } from 'react-router-dom';
import { type Event } from '../../services/eventService';
import {
    Calendar,
    Clock,
    MapPin,
    Users as UsersIcon,
    Check,
    HelpCircle,
    Shield,
    Layout,
    Users,
    Zap,
    PartyPopper,
    BookOpen,
    Coffee,
    MoreHorizontal,
    IndianRupee,
    Ticket
} from 'lucide-react';

interface EventCardProps {
    event: Event;
    onRsvp?: (eventId: string, status: 'GOING' | 'MAYBE' | 'DECLINED') => void;
}

export default function EventCard({ event, onRsvp }: EventCardProps) {
    const eventDate = new Date(event.date);
    const attendeeCount = event._count?.attendees || 0;

    // Event type configuration
    const getTypeConfig = (type: string) => {
        const configs: Record<string, { color: string; icon: any; label: string }> = {
            NETWORKING: { color: '#059669', icon: UsersIcon, label: 'Networking' },
            WORKSHOP: { color: '#DC2626', icon: Zap, label: 'Workshop' },
            SOCIAL: { color: '#EA580C', icon: PartyPopper, label: 'Social' },
            EDUCATIONAL: { color: '#2563EB', icon: BookOpen, label: 'Educational' },
            COMMUNITY: { color: '#6D28D9', icon: Layout, label: 'Community' },
            ONE_TO_ONE: { color: '#7C3AED', icon: Coffee, label: '1-to-1' },
        };
        return configs[type] || { color: '#6B7280', icon: Calendar, label: type.replace('_', ' ') };
    };

    const config = getTypeConfig(event.type);
    const IconComponent = config.icon;

    const getRsvpButton = () => {
        if (!onRsvp) return null;

        if (event.userRsvpStatus === 'GOING') {
            return (
                <div className="rsvp-status-badge going">
                    <Check size={14} />
                    <span>Going</span>
                </div>
            );
        }

        if (event.userRsvpStatus === 'MAYBE') {
            return (
                <div className="rsvp-status-badge maybe">
                    <HelpCircle size={14} />
                    <span>Maybe</span>
                </div>
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

    const isPastEvent = new Date() > eventDate;

    return (
        <Link
            to={`/dashboard/home/events/${event.id}`}
            className={`event-card ${isPastEvent ? 'past-event' : ''}`}
        >
            <div className="event-card-top">
                <div
                    className="event-type-badge-premium"
                    style={{ '--badge-color': config.color } as any}
                >
                    <IconComponent size={12} />
                    <span>{config.label}</span>
                </div>

                <div className="event-date-box-premium">
                    <span className="day">{eventDate.getDate()}</span>
                    <span className="month">
                        {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                </div>
            </div>

            <div className="event-content-premium">
                <h3 className="event-title">{event.title}</h3>

                <p className="event-description">
                    {event.description.length > 90
                        ? `${event.description.substring(0, 90)}...`
                        : event.description}
                </p>

                <div className="event-meta-premium">
                    <div className="meta-item">
                        <Clock size={14} />
                        <span>
                            {eventDate.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>

                    {event.isVirtual ? (
                        <div className="meta-item">
                            <Shield size={14} />
                            <span>Virtual Event</span>
                        </div>
                    ) : event.location ? (
                        <div className="meta-item">
                            <MapPin size={14} />
                            <span className="truncate">{event.location}</span>
                        </div>
                    ) : null}

                    <div className="meta-item">
                        <Users size={14} />
                        <span>{attendeeCount} attending</span>
                    </div>

                    <div className="meta-item">
                        {event.entryFee && event.entryFee > 0 ? (
                            <>
                                <IndianRupee size={14} />
                                <span>{event.entryFee}</span>
                            </>
                        ) : (
                            <>
                                <Ticket size={14} />
                                <span>Free</span>
                            </>
                        )}
                    </div>
                </div>

                {event.chapter && (
                    <div className="event-chapter-chip">
                        <div className="chapter-dot" />
                        <span>{event.chapter.name}</span>
                    </div>
                )}
            </div>

            <div className="event-footer-premium">
                <div className="event-organizer-premium">
                    <img
                        src={
                            event.creator.profilePhoto
                                ? event.creator.profilePhoto.startsWith('http')
                                    ? event.creator.profilePhoto
                                    : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${event.creator.profilePhoto}`
                                : `https://ui-avatars.com/api/?name=${event.creator.firstName}+${event.creator.lastName}&background=6D28D9&color=fff`
                        }
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${event.creator.firstName}+${event.creator.lastName}&background=6D28D9&color=fff`;
                        }}
                        alt={`${event.creator.firstName} ${event.creator.lastName}`}
                        className="organizer-avatar-mini"
                    />
                    <div className="organizer-info-mini">
                        <span className="by-label">by</span>
                        <span className="organizer-name-mini">
                            {event.creator.firstName} {event.creator.lastName}
                        </span>
                    </div>
                </div>

                <div className="event-actions-area">
                    {getRsvpButton()}
                </div>
            </div>
        </Link>
    );
}

