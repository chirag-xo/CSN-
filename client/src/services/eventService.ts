import api from './api';

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
    entryFee?: number;
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
    entryFee?: number;
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
        const response = await api.post('/events', data);
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

        const response = await api.get(`/events?${params.toString()}`);
        return response.data;
    },

    /**
     * Get upcoming events
     */
    async getUpcomingEvents() {
        const response = await api.get('/events/upcoming');
        return response.data;
    },

    /**
     * Get user's events (created + attending)
     */
    async getMyEvents() {
        const response = await api.get('/events/my-events');
        return response.data;
    },

    /**
     * Get event by ID
     */
    async getEventById(id: string) {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    /**
     * Update an event
     */
    async updateEvent(id: string, data: Partial<CreateEventData>) {
        const response = await api.patch(`/events/${id}`, data);
        return response.data;
    },

    /**
     * Delete an event
     */
    async deleteEvent(id: string) {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    },

    /**
     * RSVP to an event
     */
    async rsvpToEvent(eventId: string, status: 'GOING' | 'MAYBE' | 'DECLINED') {
        const response = await api.post(`/events/${eventId}/rsvp`, { status });
        return response.data;
    },

    /**
     * Get attendees for an event
     */
    async getAttendees(eventId: string) {
        const response = await api.get(`/events/${eventId}/attendees`);
        return response.data;
    },

    /**
     * Get events by chapter
     */
    async getEventsByChapter(chapterId: string) {
        const response = await api.get(`/events/chapter/${chapterId}`);
        return response.data;
    },

    /**
     * Get user's invited events (paginated)
     */
    async getInvitations(limit = 10, offset = 0) {
        const response = await api.get(
            `/events/invitations?limit=${limit}&offset=${offset}`
        );
        return response.data;
    },

    /**
     * Get pending invitation count
     */
    async getInvitationCount() {
        const response = await api.get('/events/invitations/count');
        return response.data;
    },

    /**
     * Get invitation statistics for an event (organizer only)
     */
    async getInvitationStats(eventId: string) {
        const response = await api.get(`/events/${eventId}/invitation-stats`);
        return response.data;
    },

    /**
     * Add more invitees to a private event (organizer only)
     */
    async addInvitees(eventId: string, invitedUserIds: string[]) {
        const response = await api.post(`/events/${eventId}/invite`, { invitedUserIds });
        return response.data;
    },

    /**
     * Export attendee list as CSV (organizer only)
     */
    async exportAttendees(eventId: string) {
        const response = await api.get(
            `/events/${eventId}/attendees/export`,
            {
                responseType: 'blob', // Important for file download
            }
        );
        return response;
    },
};

export default eventService;
