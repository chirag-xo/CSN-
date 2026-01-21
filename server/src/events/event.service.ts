import prisma from '../shared/database';

interface CreateEventDto {
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

interface UpdateEventDto {
    title?: string;
    description?: string;
    type?: string;
    location?: string;
    isVirtual?: boolean;
    virtualLink?: string;
    date?: Date;
    endDate?: Date;
}

interface EventFilters {
    type?: string;
    chapterId?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
}

// RSVP Transition Rules - Explicit state machine
const ALLOWED_RSVP_TRANSITIONS: Record<string, string[]> = {
    INVITED: ['GOING', 'MAYBE', 'DECLINED'],
    GOING: ['MAYBE', 'DECLINED'],
    MAYBE: ['GOING', 'DECLINED'],
    DECLINED: [], // Cannot un-decline
};

class EventService {
    /**
     * Create a new event
     */
    async createEvent(data: CreateEventDto, creatorId: string) {
        // Validate dates
        const eventDate = new Date(data.date);
        if (eventDate < new Date()) {
            throw new Error('Event date must be in the future');
        }

        if (data.endDate) {
            const endDate = new Date(data.endDate);
            if (endDate < eventDate) {
                throw new Error('End date must be after start date');
            }
        }

        // Validate private event has invitees
        const isPublic = data.isPublic !== false; // Default to true
        if (!isPublic && (!data.invitedUserIds || data.invitedUserIds.length === 0)) {
            throw new Error('Private events must have at least one invitee');
        }

        // Create event
        const event = await prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                type: data.type,
                location: data.location,
                isVirtual: data.isVirtual || false,
                virtualLink: data.virtualLink,
                date: new Date(data.date),
                endDate: data.endDate ? new Date(data.endDate) : null,
                isRecurring: data.isRecurring || false,
                recurrenceType: data.recurrenceType,
                chapterId: data.chapterId,
                creatorId,
                isPublic,
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                        company: true,
                        position: true,
                    },
                },
                chapter: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                    },
                },
                _count: {
                    select: {
                        attendees: true,
                    },
                },
            },
        });

        // Auto-add organizer as ORGANIZER with GOING status
        await prisma.eventAttendee.create({
            data: {
                eventId: event.id,
                userId: creatorId,
                status: 'GOING',
                role: 'ORGANIZER',
            },
        });

        // If private event, send invitations
        if (!isPublic && data.invitedUserIds && data.invitedUserIds.length > 0) {
            await prisma.eventAttendee.createMany({
                data: data.invitedUserIds
                    .filter(userId => userId !== creatorId) // Don't invite organizer
                    .map(userId => ({
                        eventId: event.id,
                        userId,
                        status: 'INVITED',
                        role: 'ATTENDEE',
                    })),
            });
        }

        return event;
    }
    /**
     * Get events with filters
     */
    async getEvents(filters: EventFilters, userId?: string) {
        const where: any = {};

        if (filters.type) {
            where.type = filters.type;
        }

        if (filters.chapterId) {
            where.chapterId = filters.chapterId;
        }

        if (filters.startDate || filters.endDate) {
            where.date = {};
            if (filters.startDate) {
                where.date.gte = filters.startDate;
            }
            if (filters.endDate) {
                where.date.lte = filters.endDate;
            }
        }

        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                { location: { contains: filters.search, mode: 'insensitive' } },
                {
                    creator: {
                        OR: [
                            { firstName: { contains: filters.search, mode: 'insensitive' } },
                            { lastName: { contains: filters.search, mode: 'insensitive' } },
                        ],
                    },
                },
                {
                    chapter: {
                        OR: [
                            { name: { contains: filters.search, mode: 'insensitive' } },
                            { city: { contains: filters.search, mode: 'insensitive' } },
                        ],
                    },
                },
            ];
        }

        const events = await prisma.event.findMany({
            where,
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                    },
                },
                chapter: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                attendees: userId
                    ? {
                        where: { userId },
                        select: { status: true },
                    }
                    : false,
                _count: {
                    select: {
                        attendees: true,
                    },
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        // Add user RSVP status to each event
        const eventsWithRsvp = events.map((event) => ({
            ...event,
            userRsvpStatus: event.attendees?.[0]?.status || null,
            attendees: undefined, // Remove attendees array, only keep count
        }));

        return eventsWithRsvp;
    }

    /**
     * Get upcoming events
     */
    async getUpcomingEvents(userId?: string) {
        return this.getEvents(
            {
                startDate: new Date(),
            },
            userId
        );
    }

    /**
     * Get a single event by ID
     */
    async getEventById(eventId: string, userId?: string) {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                        company: true,
                        position: true,
                    },
                },
                chapter: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                    },
                },
                attendees: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profilePhoto: true,
                                company: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
                _count: {
                    select: {
                        attendees: true,
                    },
                },
            },
        });

        if (!event) {
            throw new Error('Event not found');
        }

        // Get user's RSVP status if userId provided
        let userRsvpStatus = null;
        if (userId) {
            const userAttendee = event.attendees.find((a) => a.userId === userId);
            userRsvpStatus = userAttendee?.status || null;
        }

        return {
            ...event,
            userRsvpStatus,
            isOrganizer: userId ? event.creatorId === userId : false,
        };
    }

    /**
     * Update an event
     */
    async updateEvent(eventId: string, data: UpdateEventDto, userId: string) {
        // Check if user is the creator
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { creatorId: true },
        });

        if (!event) {
            throw new Error('Event not found');
        }

        if (event.creatorId !== userId) {
            throw new Error('Only event creator can update the event');
        }

        // Validate dates if provided
        if (data.date && new Date(data.date) < new Date()) {
            throw new Error('Event date must be in the future');
        }

        if (data.endDate && data.date && new Date(data.endDate) < new Date(data.date)) {
            throw new Error('End date must be after start date');
        }

        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data,
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                    },
                },
                chapter: true,
                _count: {
                    select: {
                        attendees: true,
                    },
                },
            },
        });

        return updatedEvent;
    }

    /**
     * Delete an event
     */
    async deleteEvent(eventId: string, userId: string) {
        // Check if user is the creator
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { creatorId: true },
        });

        if (!event) {
            throw new Error('Event not found');
        }

        if (event.creatorId !== userId) {
            throw new Error('Only event creator can delete the event');
        }

        await prisma.event.delete({
            where: { id: eventId },
        });

        return { message: 'Event deleted successfully' };
    }

    /**
     * RSVP to an event
     */
    async rsvpToEvent(eventId: string, userId: string, status: string) {
        // Validate status
        const validStatuses = ['GOING', 'MAYBE', 'DECLINED'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid RSVP status');
        }

        // Check if event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            throw new Error('Event not found');
        }

        // Check if user already RSVP'd
        const existingRsvp = await prisma.eventAttendee.findUnique({
            where: {
                eventId_userId: {
                    eventId,
                    userId,
                },
            },
        });

        if (existingRsvp) {
            // Validate transition
            const currentStatus = existingRsvp.status;
            const allowedTransitions = ALLOWED_RSVP_TRANSITIONS[currentStatus] || [];

            if (!allowedTransitions.includes(status)) {
                throw new Error(
                    `Cannot change RSVP from ${currentStatus} to ${status}. ` +
                    `Allowed transitions: ${allowedTransitions.join(', ') || 'none'}`
                );
            }

            // Update existing RSVP
            const updated = await prisma.eventAttendee.update({
                where: {
                    eventId_userId: {
                        eventId,
                        userId,
                    },
                },
                data: { status },
            });
            return updated;
        } else {
            // Create new RSVP
            const rsvp = await prisma.eventAttendee.create({
                data: {
                    eventId,
                    userId,
                    status,
                },
            });
            return rsvp;
        }
    }

    /**
     * Get attendees for an event
     */
    async getAttendees(eventId: string) {
        const attendees = await prisma.eventAttendee.findMany({
            where: { eventId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                        company: true,
                        position: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        return attendees;
    }

    /**
     * Get user's events (created + attending)
     */
    async getMyEvents(userId: string) {
        // Get created events
        const createdEvents = await prisma.event.findMany({
            where: { creatorId: userId },
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                    },
                },
                chapter: true,
                _count: {
                    select: {
                        attendees: true,
                    },
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        // Get events user is attending
        const attendingEvents = await prisma.eventAttendee.findMany({
            where: {
                userId,
                status: {
                    in: ['GOING', 'MAYBE'],
                },
            },
            include: {
                event: {
                    include: {
                        creator: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profilePhoto: true,
                            },
                        },
                        chapter: true,
                        _count: {
                            select: {
                                attendees: true,
                            },
                        },
                    },
                },
            },
        });

        return {
            created: createdEvents,
            attending: attendingEvents.map((a) => ({
                ...a.event,
                userRsvpStatus: a.status,
            })),
        };
    }

    /**
     * Get invited events for a user (with pagination)
     */
    async getInvitedEvents(userId: string, limit = 10, offset = 0) {
        // Get total count
        const total = await prisma.eventAttendee.count({
            where: { userId, status: 'INVITED' },
        });

        // Get paginated invitations
        const invitations = await prisma.eventAttendee.findMany({
            where: {
                userId,
                status: 'INVITED',
            },
            include: {
                event: {
                    include: {
                        creator: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profilePhoto: true,
                            },
                        },
                        chapter: {
                            select: {
                                id: true,
                                name: true,
                                city: true,
                            },
                        },
                        _count: {
                            select: {
                                attendees: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });

        return {
            invitations: invitations.map((inv) => ({
                ...inv.event,
                invitedAt: inv.createdAt,
                // Optional: Add "respond by" suggestion (24h before event)
                suggestedRespondBy: new Date(
                    new Date(inv.event.date).getTime() - 24 * 60 * 60 * 1000
                ),
            })),
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total,
            },
        };
    }

    /**
     * Get invitation stats for an event (organizer only)
     */
    async getInvitationStats(eventId: string, requestingUserId: string) {
        // 1. Verify event exists and check authorization
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { creatorId: true },
        });

        if (!event) {
            throw new Error('Event not found');
        }

        // 2. AUTHORIZATION: Only organizer can see stats
        if (event.creatorId !== requestingUserId) {
            throw new Error('Only event organizer can view invitation stats');
        }

        // 3. Fetch attendees
        const attendees = await prisma.eventAttendee.findMany({
            where: { eventId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                        company: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        // 4. PERFORMANCE: Single-pass aggregation using reduce
        const statsByStatus = attendees.reduce(
            (acc, attendee) => {
                const status = attendee.status;
                if (!acc[status]) {
                    acc[status] = { count: 0, users: [] };
                }
                acc[status].count++;
                acc[status].users.push({
                    ...attendee.user,
                    respondedAt: attendee.createdAt, // Use createdAt as EventAttendee doesn't track updates
                    role: attendee.role,
                });
                return acc;
            },
            {} as Record<string, { count: number; users: any[] }>
        );

        const total = attendees.length;
        const responded = total - (statsByStatus.INVITED?.count || 0);

        return {
            total,
            invited: statsByStatus.INVITED?.count || 0,
            going: statsByStatus.GOING?.count || 0,
            maybe: statsByStatus.MAYBE?.count || 0,
            declined: statsByStatus.DECLINED?.count || 0,
            responseRate: total > 0 ? Math.round((responded / total) * 100) : 0,
            byStatus: {
                invited: statsByStatus.INVITED?.users || [],
                going: statsByStatus.GOING?.users || [],
                maybe: statsByStatus.MAYBE?.users || [],
                declined: statsByStatus.DECLINED?.users || [],
            },
        };
    }

    /**
     * Get events by chapter
     */
    async getEventsByChapter(chapterId: string, userId?: string) {
        return this.getEvents({ chapterId }, userId);
    }

    /**
     * Add more invitees to a private event (organizer only)
     */
    async addInvitees(eventId: string, organizerId: string, invitedUserIds: string[]) {
        // 1. Verify event exists and user is organizer
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { creatorId: true, isPublic: true },
        });

        if (!event) {
            throw new Error('Event not found');
        }

        if (event.creatorId !== organizerId) {
            throw new Error('Only event organizer can add invitees');
        }

        if (event.isPublic) {
            throw new Error('Cannot add invitees to public events');
        }

        // 2. Filter out users already invited/attending
        const existing = await prisma.eventAttendee.findMany({
            where: { eventId },
            select: { userId: true },
        });

        const existingUserIds = existing.map((a) => a.userId);
        const newInvitees = invitedUserIds.filter(
            (id) => !existingUserIds.includes(id)
        );

        if (newInvitees.length === 0) {
            return { invited: 0, message: 'All selected users are already invited' };
        }

        // 3. Create new attendees with INVITED status
        await prisma.eventAttendee.createMany({
            data: newInvitees.map((userId) => ({
                eventId,
                userId,
                status: 'INVITED',
                role: 'ATTENDEE',
            })),
        });

        return { invited: newInvitees.length };
    }

    /**
     * Export attendee list as CSV (organizer only)
     */
    async exportAttendees(eventId: string, requestingUserId: string) {
        // 1. Verify event exists and user is organizer
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { creatorId: true, title: true },
        });

        if (!event) {
            throw new Error('Event not found');
        }

        if (event.creatorId !== requestingUserId) {
            throw new Error('Only event organizer can export attendees');
        }

        // 2. Fetch all attendees with user details
        const attendees = await prisma.eventAttendee.findMany({
            where: { eventId },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        company: true,
                        position: true,
                        city: true,
                    },
                },
            },
            orderBy: { status: 'asc' },
        });

        // 3. Generate CSV
        const csvRows = [
            // Header
            ['Name', 'Email', 'Company', 'Position', 'Location', 'Status', 'Role'].join(','),
            // Data rows
            ...attendees.map((a) =>
                [
                    `"${a.user.firstName} ${a.user.lastName}"`,
                    a.user.email,
                    `"${a.user.company || ''}"`,
                    `"${a.user.position || ''}"`,
                    `"${a.user.city || ''}"`,
                    a.status,
                    a.role,
                ].join(',')
            ),
        ];

        const csv = csvRows.join('\n');
        const filename = `${event.title.replace(/[^a-z0-9]/gi, '_')}_attendees.csv`;

        return { csv, filename };
    }
}

export default new EventService();
