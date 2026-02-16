import { v4 as uuidv4 } from 'uuid';
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
    entryFee?: number; // Fee for the event
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
    entryFee?: number;
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
                entryFee: data.entryFee,
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
                        City: {
                            select: { name: true },
                        },
                    },
                },
                _count: {
                    select: {
                        event_attendees: true,
                    },
                },
            },
        });

        // Auto-add organizer as ORGANIZER with GOING status
        await prisma.event_attendees.create({
            data: {
                id: uuidv4(),
                event_id: event.id,
                user_id: creatorId,
                status: 'GOING',
                role: 'ORGANIZER',
            },
        });

        // If private event, send invitations
        if (!isPublic && data.invitedUserIds && data.invitedUserIds.length > 0) {
            await prisma.event_attendees.createMany({
                data: data.invitedUserIds
                    .filter(userId => userId !== creatorId) // Don't invite organizer
                    .map(userId => ({
                        id: uuidv4(),
                        event_id: event.id,
                        user_id: userId,
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
                            { City: { name: { contains: filters.search, mode: 'insensitive' } } },
                        ],
                    },
                },
            ];
        }

        // Privacy Logic: Restrict visibility of private events
        // If public (isPublic: true) -> Visible to everyone
        // If private (isPublic: false) -> Visible only to Creator OR Invitees/Attendees
        const privacyFilter = userId
            ? {
                OR: [
                    { isPublic: true }, // Public events
                    { creatorId: userId }, // Created by user
                    { event_attendees: { some: { user_id: userId } } }, // User is invited/attending
                ],
            }
            : { isPublic: true }; // Guests only see public events

        // Append to existing AND or create new
        if (where.AND) {
            if (Array.isArray(where.AND)) {
                where.AND.push(privacyFilter);
            } else {
                // If AND is already an object (not array), wrap it
                where.AND = [where.AND, privacyFilter];
            }
        } else {
            where.AND = [privacyFilter];
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
                        company: true,
                        position: true,
                    },
                },
                chapter: {
                    select: {
                        id: true,
                        name: true,
                        City: {
                            select: { name: true },
                        },
                    },
                },
                event_attendees: userId
                    ? {
                        where: { user_id: userId },
                        select: { status: true },
                    }
                    : false,
                _count: {
                    select: {
                        event_attendees: true,
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
            userRsvpStatus: event.event_attendees?.[0]?.status || null,
            event_attendees: undefined, // Remove attendees array, only keep count
            chapter: event.chapter ? { ...event.chapter, city: event.chapter.City?.name } : null,
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
                        City: {
                            select: { name: true },
                        },
                    },
                },
                event_attendees: {
                    include: {
                        User: {
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
                        created_at: 'asc',
                    },
                },
                _count: {
                    select: {
                        event_attendees: true,
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
            const userAttendee = event.event_attendees.find((a) => a.user_id === userId);
            userRsvpStatus = userAttendee?.status || null;
        }

        return {
            ...event,
            userRsvpStatus,
            isOrganizer: userId ? event.creatorId === userId : false,
            chapter: event.chapter ? { ...event.chapter, city: event.chapter.City?.name } : null,
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
                        company: true,
                        position: true,
                    },
                },
                chapter: {
                    select: {
                        id: true,
                        name: true,
                        City: {
                            select: { name: true },
                        },
                    },
                },
                _count: {
                    select: {
                        event_attendees: true,
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
        const existingRsvp = await prisma.event_attendees.findUnique({
            where: {
                event_id_user_id: {
                    event_id: eventId,
                    user_id: userId,
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
            const updated = await prisma.event_attendees.update({
                where: {
                    event_id_user_id: {
                        event_id: eventId,
                        user_id: userId,
                    },
                },
                data: { status },
            });
            return updated;
        } else {
            // Create new RSVP
            const rsvp = await prisma.event_attendees.create({
                data: {
                    id: uuidv4(),
                    event_id: eventId,
                    user_id: userId,
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
        const attendees = await prisma.event_attendees.findMany({
            where: { event_id: eventId },
            include: {
                User: {
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
                created_at: 'asc',
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
                        company: true,
                        position: true,
                    },
                },
                chapter: {
                    select: {
                        id: true,
                        name: true,
                        City: {
                            select: { name: true },
                        },
                    },
                },
                _count: {
                    select: {
                        event_attendees: true,
                    },
                },
            },
            orderBy: {
                date: 'asc',
            },
        });

        // Get events user is attending
        const attendingEvents = await prisma.event_attendees.findMany({
            where: {
                user_id: userId,
                status: {
                    in: ['GOING', 'MAYBE'],
                },
            },
            include: {
                Event: {
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
                                City: {
                                    select: { name: true },
                                },
                            },
                        },
                        _count: {
                            select: {
                                event_attendees: true,
                            },
                        },
                    },
                },
            },
        });

        return {
            created: createdEvents.map(e => ({
                ...e,
                chapter: e.chapter ? { ...e.chapter, city: e.chapter.City?.name } : null
            })),
            attending: attendingEvents.map((a) => ({
                ...a.Event,
                userRsvpStatus: a.status,
                chapter: a.Event.chapter ? { ...a.Event.chapter, city: a.Event.chapter.City?.name } : null
            })),
        };
    }

    /**
     * Get invited events for a user (with pagination)
     */
    async getInvitedEvents(userId: string, limit = 10, offset = 0) {
        // Get total count
        const total = await prisma.event_attendees.count({
            where: { user_id: userId, status: 'INVITED' },
        });

        // Get paginated invitations
        const invitations = await prisma.event_attendees.findMany({
            where: {
                user_id: userId,
                status: 'INVITED',
            },
            include: {
                Event: {
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
                                City: {
                                    select: { name: true },
                                },
                            },
                        },
                        _count: {
                            select: {
                                event_attendees: true,
                            },
                        },
                    },
                },
            },
            orderBy: { created_at: 'desc' },
            take: limit,
            skip: offset,
        });

        return {
            invitations: invitations.map((inv) => ({
                id: inv.Event.id,
                title: inv.Event.title,
                date: inv.Event.date,
                location: inv.Event.location,
                isVirtual: inv.Event.isVirtual,
                virtualLink: inv.Event.virtualLink,
                creator: inv.Event.creator,
                chapter: inv.Event.chapter ? { ...inv.Event.chapter, city: inv.Event.chapter.City?.name } : null,
                invitedAt: inv.created_at,
            })),
            total,
        };
    }

    /**
     * Get pending invitation count for a user
     */
    async getInvitationCount(userId: string) {
        const count = await prisma.event_attendees.count({
            where: {
                user_id: userId,
                status: 'INVITED',
            },
        });
        return { count };
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
        const attendees = await prisma.event_attendees.findMany({
            where: { event_id: eventId },
            include: {
                User: {
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
            orderBy: { created_at: 'asc' },
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
                    ...attendee.User,
                    respondedAt: attendee.created_at, // Use created_at as event_attendees doesn't track updates
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
        const existing = await prisma.event_attendees.findMany({
            where: { event_id: eventId },
            select: { user_id: true },
        });

        const existingUserIds = existing.map((a) => a.user_id);
        const newInvitees = invitedUserIds.filter(
            (id) => !existingUserIds.includes(id)
        );

        if (newInvitees.length === 0) {
            return { invited: 0, message: 'All selected users are already invited' };
        }

        // 3. Create new attendees with INVITED status
        await prisma.event_attendees.createMany({
            data: newInvitees.map((userId) => ({
                id: uuidv4(),
                event_id: eventId,
                user_id: userId,
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
        const attendees = await prisma.event_attendees.findMany({
            where: { event_id: eventId },
            include: {
                User: {
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
                    `"${a.User.firstName} ${a.User.lastName}"`,
                    a.User.email,
                    `"${a.User.company || ''}"`,
                    `"${a.User.position || ''}"`,
                    `"${a.User.city || ''}"`,
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
