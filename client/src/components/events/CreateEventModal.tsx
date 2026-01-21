import { useState, useEffect } from 'react';
import { Globe, Lock } from 'lucide-react';
import eventService, { type CreateEventData } from '../../services/eventService';
import connectionService from '../../services/connectionService';
import '../../styles/createEventModal.css';

interface CreateEventModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

interface Connection {
    id: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto?: string;
        company?: string;
    };
}

export default function CreateEventModal({ onClose, onSuccess }: CreateEventModalProps) {
    const [formData, setFormData] = useState<CreateEventData>({
        title: '',
        description: '',
        type: 'NETWORKING',
        location: '',
        isVirtual: false,
        virtualLink: '',
        date: '',
        endDate: '',
        isRecurring: false,
        recurrenceType: '',
        isPublic: true,  // NEW: Default to public
        invitedUserIds: [],  // NEW: For private events
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [connections, setConnections] = useState<Connection[]>([]);
    const [fetchingConnections, setFetchingConnections] = useState(false);

    // Fetch connections when private event is selected
    useEffect(() => {
        if (!formData.isPublic && connections.length === 0) {
            fetchConnections();
        }
    }, [formData.isPublic, connections.length]); // Added connections.length to dependency array

    const fetchConnections = async () => {
        try {
            setFetchingConnections(true);
            const connectionsData = await connectionService.getConnections();
            // connectionService.getConnections() returns { data: [...] }
            setConnections(connectionsData.data || []);
        } catch (err) {
            console.error('Failed to fetch connections:', err);
            setConnections([]);
        } finally {
            setFetchingConnections(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
                // If switching to public, clear invitedUserIds
                ...(name === 'isPublic' && checked ? { invitedUserIds: [] } : {}),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleInviteeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setFormData((prev) => ({
            ...prev,
            invitedUserIds: selectedOptions,
        }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Event title is required');
            return false;
        }

        if (formData.title.length > 100) {
            setError('Event title must be less than 100 characters');
            return false;
        }

        if (!formData.description.trim()) {
            setError('Event description is required');
            return false;
        }

        if (!formData.date) {
            setError('Event date is required');
            return false;
        }

        const eventDate = new Date(formData.date);
        if (eventDate < new Date()) {
            setError('Event date must be in the future');
            return false;
        }

        if (formData.endDate) {
            const endDate = new Date(formData.endDate);
            if (endDate < eventDate) {
                setError('End date must be after start date');
                return false;
            }
        }

        if (formData.isVirtual && !formData.virtualLink?.trim()) {
            setError('Virtual link is required for virtual events');
            return false;
        }

        if (!formData.isVirtual && !formData.location?.trim()) {
            setError('Location is required for in-person events');
            return false;
        }

        // Validate private event has invitees
        if (!formData.isPublic && (!formData.invitedUserIds || formData.invitedUserIds.length === 0)) {
            setError('Private events must have at least one invitee');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Convert datetime-local to ISO-8601 DateTime for Prisma
            const convertToISOString = (dateTimeLocal: string) => {
                if (!dateTimeLocal) return undefined;
                // datetime-local gives us "YYYY-MM-DDTHH:mm" format
                // Create a Date object and convert to ISO string
                const date = new Date(dateTimeLocal);
                return date.toISOString();
            };

            // Clean up data
            const submitData: CreateEventData = {
                ...formData,
                date: convertToISOString(formData.date)!,
                endDate: formData.endDate ? convertToISOString(formData.endDate) : undefined,
                location: formData.isVirtual ? undefined : formData.location,
                virtualLink: formData.isVirtual ? formData.virtualLink : undefined,
                recurrenceType: formData.isRecurring ? formData.recurrenceType : undefined,
            };

            await eventService.createEvent(submitData);
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Create event error:', err);
            setError(err.response?.data?.error?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create Event</h2>
                    <button className="close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="event-form">
                    {error && <div className="error-message">{error}</div>}

                    {/* Title */}
                    <div className="form-group">
                        <label htmlFor="title">
                            Event Title <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Monthly Networking Mixer"
                            maxLength={100}
                        />
                        <div className="char-count">{formData.title.length}/100</div>
                    </div>

                    {/* Type */}
                    <div className="form-group">
                        <label htmlFor="type">
                            Event Type <span className="required">*</span>
                        </label>
                        <select id="type" name="type" value={formData.type} onChange={handleChange}>
                            <option value="NETWORKING">Networking</option>
                            <option value="WORKSHOP">Workshop</option>
                            <option value="SOCIAL">Social</option>
                            <option value="EDUCATIONAL">Educational</option>
                            <option value="COMMUNITY">Community</option>
                            <option value="ONE_TO_ONE">One-to-One</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label htmlFor="description">
                            Description <span className="required">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your event..."
                            rows={4}
                        />
                    </div>

                    {/* Date & Time */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="date">
                                Start Date & Time <span className="required">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate">End Date & Time</label>
                            <input
                                type="datetime-local"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Virtual Event Toggle */}
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="isVirtual"
                                checked={formData.isVirtual}
                                onChange={handleChange}
                            />
                            <span>This is a virtual event</span>
                        </label>
                    </div>

                    {/* Location or Virtual Link */}
                    {formData.isVirtual ? (
                        <div className="form-group">
                            <label htmlFor="virtualLink">
                                Virtual Link <span className="required">*</span>
                            </label>
                            <input
                                type="url"
                                id="virtualLink"
                                name="virtualLink"
                                value={formData.virtualLink}
                                onChange={handleChange}
                                placeholder="https://zoom.us/j/..."
                            />
                        </div>
                    ) : (
                        <div className="form-group">
                            <label htmlFor="location">
                                Location <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Downtown Conference Center"
                            />
                        </div>
                    )}

                    {/* Recurring */}
                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="isRecurring"
                                checked={formData.isRecurring}
                                onChange={handleChange}
                            />
                            <span>Recurring event</span>
                        </label>
                    </div>

                    {formData.isRecurring && (
                        <div className="form-group">
                            <label htmlFor="recurrenceType">Recurrence Type</label>
                            <select
                                id="recurrenceType"
                                name="recurrenceType"
                                value={formData.recurrenceType}
                                onChange={handleChange}
                            >
                                <option value="">Select recurrence</option>
                                <option value="WEEKLY">Weekly</option>
                                <option value="MONTHLY">Monthly</option>
                            </select>
                        </div>
                    )}

                    {/* Event Visibility */}
                    <div className="form-group">
                        <label>Event Visibility</label>
                        <div className="visibility-toggle">
                            <label className={`radio-label ${formData.isPublic ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="isPublic"
                                    checked={formData.isPublic === true}
                                    onChange={() => setFormData(prev => ({ ...prev, isPublic: true, invitedUserIds: [] }))}
                                />
                                <div className="radio-content">
                                    <Globe size={18} className="radio-icon" />
                                    <span>Public - Anyone can see and join</span>
                                </div>
                            </label>
                            <label className={`radio-label ${!formData.isPublic ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="isPublic"
                                    checked={formData.isPublic === false}
                                    onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                                />
                                <div className="radio-content">
                                    <Lock size={18} className="radio-icon" />
                                    <span>Private - Only invited people</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Connection Selector (only for private events) */}
                    {!formData.isPublic && (
                        <div className="form-group">
                            <label htmlFor="invitedUserIds">
                                Invite Connections <span className="required">*</span>
                            </label>
                            {fetchingConnections ? (
                                <div className="loading-connections">Loading your connections...</div>
                            ) : connections.length === 0 ? (
                                <div className="no-connections">
                                    You don't have any connections yet. Connect with people first to create private events.
                                </div>
                            ) : (
                                <>
                                    <select
                                        id="invitedUserIds"
                                        multiple
                                        size={6}
                                        value={formData.invitedUserIds}
                                        onChange={handleInviteeChange}
                                        className="connection-selector"
                                    >
                                        {connections.map((connection) => (
                                            <option key={connection.user.id} value={connection.user.id}>
                                                {connection.user.firstName} {connection.user.lastName}
                                                {connection.user.company && ` - ${connection.user.company}`}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="selector-hint">
                                        Hold Cmd (Mac) or Ctrl (Windows) to select multiple people
                                        {formData.invitedUserIds && formData.invitedUserIds.length > 0 && (
                                            <span className="selected-count">
                                                {' '}• {formData.invitedUserIds.length} selected
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
