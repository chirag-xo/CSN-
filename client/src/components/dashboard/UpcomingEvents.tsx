import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Video, Plus, ArrowRight, X } from 'lucide-react';
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusStyle = (status: string) => {
        const styles = {
            GOING: { label: 'Going', bg: '#DCFCE7', color: '#166534' },
            MAYBE: { label: 'Maybe', bg: '#FEF3C7', color: '#B45309' },
            INVITED: { label: 'Invited', bg: '#F3E8FF', color: '#6B21A8' },
            NOT_GOING: { label: 'Not Going', bg: '#FEE2E2', color: '#991B1B' },
        };
        return styles[status as keyof typeof styles] || styles.INVITED;
    };

    // Limit to 3 items for desktop row
    const displayEvents = events.slice(0, 3);

    return (
        <div className="upcoming-events-section">
            {/* Header */}
            <div className="ue-header">
                <h3 className="ue-title">Upcoming Meetings & Events</h3>
                <div className="ue-actions">
                    <button
                        className="ue-btn-primary"
                        onClick={() => navigate('/dashboard/home/events')}
                    >
                        <Plus size={16} /> Create Event
                    </button>
                    <button
                        className="ue-btn-secondary"
                        onClick={() => navigate('/dashboard/home/events')}
                    >
                        View All <ArrowRight size={14} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {events.length === 0 ? (
                <div className="ue-empty-state">
                    <Calendar className="ue-empty-icon" />
                    <p className="ue-empty-text">No upcoming events scheduled</p>
                    <button
                        className="ue-btn-primary"
                        onClick={() => navigate('/dashboard/home/events')}
                    >
                        Create your first event
                    </button>
                </div>
            ) : (
                <div className="ue-grid">
                    {displayEvents.map((event) => {
                        const status = getStatusStyle(event.rsvpStatus);
                        return (
                            <div
                                key={event.id}
                                className="ue-card"
                                onClick={() => navigate(`/dashboard/home/events/${event.id}`)}
                            >
                                <div className="ue-card-top">
                                    <span
                                        className="ue-status-badge"
                                        style={{ backgroundColor: status.bg, color: status.color }}
                                    >
                                        {status.label}
                                    </span>
                                    <span className="ue-date-pill">
                                        {formatDate(event.date)}
                                    </span>
                                </div>

                                <div className="ue-card-content">
                                    <h4 className="ue-card-title">{event.title}</h4>

                                    <div className="ue-meta-group">
                                        <div className="ue-meta-row">
                                            <Clock className="ue-meta-icon" />
                                            <span>{formatTime(event.date)}</span>
                                        </div>
                                        <div className="ue-meta-row">
                                            {event.isVirtual ? (
                                                <Video className="ue-meta-icon" />
                                            ) : (
                                                <MapPin className="ue-meta-icon" />
                                            )}
                                            <span className="truncate">
                                                {event.isVirtual ? 'Virtual Event' : (event.location || 'TBD')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="ue-card-footer">
                                    <button className="ue-details-btn">
                                        View Details <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
