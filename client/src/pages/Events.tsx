import { useState, useEffect } from 'react';
import eventService, { type Event, type EventFilters } from '../services/eventService';
import EventCard from '../components/events/EventCard';
import CreateEventModal from '../components/events/CreateEventModal';
import Breadcrumb from '../components/common/Breadcrumb';
import { Search, Plus, Calendar, List, Lock, MapPin, Clock, Lightbulb, Check, X } from 'lucide-react';
import '../styles/events.css';

type ViewMode = 'list' | 'calendar';
type TabType = 'upcoming' | 'invitations';

export default function Events() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [filters, setFilters] = useState<EventFilters>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Invitations tab state
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');
    const [invitations, setInvitations] = useState<any[]>([]);
    const [invitationCount, setInvitationCount] = useState(0);
    const [invitationsLoading, setInvitationsLoading] = useState(false);

    useEffect(() => {
        fetchInvitationCount();
        if (activeTab === 'upcoming') {
            fetchEvents();
        } else {
            fetchInvitations();
        }
    }, [filters, activeTab]);

    const fetchInvitationCount = async () => {
        try {
            const response = await eventService.getInvitationCount();
            setInvitationCount(response.data.count);
        } catch (err) {
            console.error('Failed to fetch invitation count:', err);
        }
    };

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await eventService.getUpcomingEvents();
            setEvents(response.data);
        } catch (err: any) {
            console.error('Failed to fetch events:', err);
            setError(err.response?.data?.error?.message || 'Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const fetchInvitations = async () => {
        try {
            setInvitationsLoading(true);
            setError('');
            const response = await eventService.getInvitations();
            setInvitations(response.data.invitations || []);
            // Update count when fetching full list
            if (response.data.invitations) {
                setInvitationCount(response.data.invitations.length);
            }
        } catch (err: any) {
            console.error('Failed to fetch invitations:', err);
            setError(err.response?.data?.error?.message || 'Failed to load invitations');
        } finally {
            setInvitationsLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await eventService.getEvents({
                ...filters,
                search: searchQuery || undefined,
            });
            setEvents(response.data);
        } catch (err: any) {
            console.error('Search error:', err);
            setError('Failed to search events');
        } finally {
            setLoading(false);
        }
    };

    const handleRsvp = async (eventId: string, status: 'GOING' | 'MAYBE' | 'DECLINED') => {
        try {
            await eventService.rsvpToEvent(eventId, status);
            // Refresh events to update RSVP status
            fetchEvents();
        } catch (err: any) {
            console.error('RSVP error:', err);
            alert('Failed to RSVP. Please try again.');
        }
    };

    const handleFilterChange = (key: keyof EventFilters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value || undefined,
        }));
    };

    const filteredEvents = events.filter((event) => {
        if (filters.type && event.type !== filters.type) return false;
        if (filters.chapterId && event.chapterId !== filters.chapterId) return false;
        return true;
    });

    const handleInvitationResponse = async (eventId: string, status: 'GOING' | 'DECLINED') => {
        try {
            await eventService.rsvpToEvent(eventId, status);
            // Refresh invitations list and count
            fetchInvitations();
            fetchInvitationCount();
        } catch (err: any) {
            console.error('Failed to respond to invitation:', err);
            setError(err.response?.data?.error?.message || 'Failed to respond to invitation');
        }
    };

    return (
        <div className="events-container">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: 'Events' }]} />

            {/* Header - Premium Layout */}
            <div className="events-header">
                <div className="header-row">
                    <div>
                        <h1>Upcoming Events</h1>
                        <p className="subtitle">Discover and join community events</p>
                    </div>
                    <button
                        className="create-event-btn"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <Plus size={18} />
                        Create Event
                    </button>
                </div>
            </div>

            {/* Tabs - Compact Segmented Control */}
            <div className="events-tabs">
                <button
                    className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming
                </button>
                <button
                    className={`tab-button ${activeTab === 'invitations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('invitations')}
                >
                    Invitations
                    {invitationCount > 0 && (
                        <span className="badge">{invitationCount}</span>
                    )}
                </button>
            </div>

            {/* Unified Toolbar */}
            <div className="events-toolbar">
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search events by title, host, city..."
                        value={searchQuery}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSearchQuery(value);
                            if (value.trim() === '') {
                                fetchEvents();
                            }
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>

                <div className="toolbar-filters">
                    <select
                        className="filter-select"
                        value={filters.type || ''}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="NETWORKING">Networking</option>
                        <option value="WORKSHOP">Workshop</option>
                        <option value="SOCIAL">Social</option>
                        <option value="EDUCATIONAL">Educational</option>
                        <option value="COMMUNITY">Community</option>
                        <option value="ONE_TO_ONE">One-to-One</option>
                    </select>

                    <div className="view-toggle">
                        <button
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={16} />
                            List
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                            onClick={() => setViewMode('calendar')}
                        >
                            <Calendar size={16} />
                            Calendar
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'upcoming' ? (
                // Upcoming Events Tab
                loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading events...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                        <button className="retry-btn" onClick={fetchEvents}>
                            Try Again
                        </button>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Calendar size={32} />
                        </div>
                        <h3>No Events Found</h3>
                        <p>
                            {searchQuery || filters.type
                                ? 'Try adjusting your search or filters'
                                : 'No upcoming events at the moment'}
                        </p>
                        <button className="empty-state-cta" onClick={() => setShowCreateModal(true)}>
                            <Plus size={16} />
                            Create Event
                        </button>
                    </div>
                ) : (
                    <div className="events-view">
                        {viewMode === 'list' ? (
                            <div className="events-grid">
                                {filteredEvents.map((event) => (
                                    <EventCard key={event.id} event={event} onRsvp={handleRsvp} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <Calendar size={32} />
                                </div>
                                <h3>Calendar View</h3>
                                <p>Calendar view coming soon</p>
                            </div>
                        )}
                    </div>
                )
            ) : (
                // Invitations Tab
                invitationsLoading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading invitations...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                        <button className="retry-btn" onClick={fetchInvitations}>
                            Try Again
                        </button>
                    </div>
                ) : invitations.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Calendar size={32} />
                        </div>
                        <h3>No Pending Invitations</h3>
                        <p>You don't have any event invitations at the moment</p>
                    </div>
                ) : (
                    <div className="invitations-list">
                        <div className="invitations-header">
                            <p>You have {invitations.length} pending invitation{invitations.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="events-grid">
                            {invitations.map((event: any) => (
                                <div key={event.id} className="invitation-card">
                                    <div className="event-badge private">
                                        <Lock size={12} />
                                        Private Event
                                    </div>
                                    <h3>{event.title}</h3>
                                    <p className="event-meta">
                                        <MapPin size={14} />
                                        {event.location || 'Virtual'}
                                    </p>
                                    <p className="event-meta">
                                        <Clock size={14} />
                                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="event-organizer">
                                        Hosted by <strong>{event.creator.firstName} {event.creator.lastName}</strong>
                                    </p>
                                    <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginTop: '8px' }}>
                                        Invited {new Date(event.invitedAt).toLocaleDateString()}
                                    </p>
                                    {event.suggestedRespondBy && new Date(event.suggestedRespondBy) > new Date() && (
                                        <p className="respond-by">
                                            <Lightbulb size={14} />
                                            Respond by {new Date(event.suggestedRespondBy).toLocaleDateString()}
                                        </p>
                                    )}
                                    <div className="invitation-actions">
                                        <button
                                            className="btn-accept"
                                            onClick={() => handleInvitationResponse(event.id, 'GOING')}
                                        >
                                            <Check size={16} />
                                            Accept
                                        </button>
                                        <button
                                            className="btn-decline"
                                            onClick={() => handleInvitationResponse(event.id, 'DECLINED')}
                                        >
                                            <X size={16} />
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            )}

            {/* Create Event Modal */}
            {showCreateModal && (
                <CreateEventModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchEvents();
                    }}
                />
            )}
        </div>
    );
}
