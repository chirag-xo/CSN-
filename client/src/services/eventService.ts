import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Types
export interface Event {
    id: string;
    title: string;
    description: string;
    type: string;
    location?: string;
    isVirtual: boolean;
    virtualLink?: string;
    date: string;
    endDate?: string;
    isRecurring: boolean;
    recurrenceType?: string;
    chapterId?: string;
    creatorId: string;
    creator: {
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto?: string;
        company?: string;
        position?: string;
    };
    chapter?: {
        id: string;
        name: string;
        city?: string;
    };
    attendees?: Attendee[];
    _count?: {
        attendees: number;
    };
    userRsvpStatus?: string | null;
    isPublic: boolean;  // NEW: Public vs Private
    isOrganizer?: boolean;  // NEW: Is current user the organizer
    createdAt: string;
    updatedAt: string;
}

export interface Attendee {
    id: string;
    eventId: string;
    userId: string;
    status: string;
    role: string;
    createdAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto?: string;
        company?: string;
        position?: string;
    };
}

export interface CreateEventData {
    title: string;
    description: string;
    type: string;
    location?: string;
    isVirtual?: boolean;
    virtualLink?: string;
    date: string;
    endDate?: string;
    isRecurring?: boolean;
    recurrenceType?: string;
    chapterId?: string;
    isPublic?: boolean;  // NEW: Public vs Private
    invitedUserIds?: string[];  // NEW: For private events
}

export interface EventFilters {
    type?: string;
    chapterId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

const eventService = {
    /**
     * Create a new event
     */
    async createEvent(data: CreateEventData) {
        const response = await axios.post(`${API_URL}/api/events`, data, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    /**
     * Get events with filters
     */
    async getEvents(filters?: EventFilters) {
        const params = new URLSearchParams();
        if (filters?.type) params.append('type', filters.type);
        if (filters?.chapterId) params.append('chapterId', filters.chapterId);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);

        const response = await axios.get(`${API_URL}/api/events?${params.toString()}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    /**
     * Get upcoming events
     */
    async getUpcomingEvents() {
        const response = await axios.get(`${API_URL}/api/events/upcoming`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    /**
     * Get user's events (created + attending)
     */
    async getMyEvents() {
        const response = await axios.get(`${API_URL}/api/events/my-events`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    /**
     * Get event by ID
     */
    async getEventById(id: string) {
        const response = await axios.get(`${API_URL}/api/events/${id}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    /**
     * Update an event
     */
    async updateEvent(id: string, data: Partial<CreateEventData>) {
        const response = await axios.patch(`${API_URL}/api/events/${id}`, data, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    /**
     * Delete an event
     */
    async deleteEvent(id: string) {
        const response = await axios.delete(`${API_URL}/api/events/${id}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    /**
     * RSVP to an event
     */
    async rsvpToEvent(eventId: string, status: 'GOING' | 'MAYBE' | 'DECLINED') {
        const response = await axios.post(
            `${API_URL}/api/events/${eventId}/rsvp`,
            { status },
            {
                headers: getAuthHeader(),
            }
        );
        return response.data;
    },

    /**
     * Get attendees for an event
     */
    async getAttendees(eventId: string) {
        const response = await axios.get(`${API_URL}/api/events/${eventId}/attendees`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    /**
     * Get events by chapter
     */
    async getEventsByChapter(chapterId: string) {
        const response = await axios.get(`${API_URL}/api/events/chapter/${chapterId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    /**
     * Get user's invited events (paginated)
     */
    async getInvitations(limit = 10, offset = 0) {
        const response = await axios.get(
            `${API_URL}/api/events/invitations?limit=${limit}&offset=${offset}`,
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    /**
     * Get invitation statistics for an event (organizer only)
     */
    async getInvitationStats(eventId: string) {
        const response = await axios.get(
            `${API_URL}/api/events/${eventId}/invitation-stats`,
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    /**
     * Add more invitees to a private event (organizer only)
     */
    async addInvitees(eventId: string, invitedUserIds: string[]) {
        const response = await axios.post(
            `${API_URL}/api/events/${eventId}/invite`,
            { invitedUserIds },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    /**
     * Export attendee list as CSV (organizer only)
     */
    async exportAttendees(eventId: string) {
        const response = await axios.get(
            `${API_URL}/api/events/${eventId}/attendees/export`,
            {
                headers: getAuthHeader(),
                responseType: 'blob', // Important for file download
            }
        );
        return response;
    },
};

export default eventService;
