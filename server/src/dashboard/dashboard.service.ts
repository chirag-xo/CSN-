import prisma from '../shared/database';
import { AppError, errorCodes } from '../shared/errors';

export const dashboardService = {
    // Get dashboard summary with server-side aggregation
    async getSummary(userId: string) {
        // Get user with chapter info
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                city: true,
                chapter: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!user) {
            throw new AppError('User not found', 404, errorCodes.USER_NOT_FOUND);
        }

        // Server-side aggregation for referrals given
        const referralsGivenStats = await prisma.referral.aggregate({
            where: { fromUserId: userId },
            _count: true,
        });

        // Server-side aggregation for referrals received
        const referralsReceivedStats = await prisma.referral.aggregate({
            where: { toUserId: userId },
            _count: true,
        });

        // Converted referrals count
        const convertedReferrals = await prisma.referral.count({
            where: {
                toUserId: userId,
                status: 'CONVERTED',
            },
        });

        // Calculate profile completion (simple example)
        const profileCompletion = this.calculateProfileCompletion(await prisma.user.findUnique({
            where: { id: userId },
        }));

        // Get upcoming events where user is an attendee or invited
        const now = new Date();
        const upcomingEvents = await prisma.event.findMany({
            where: {
                date: {
                    gte: now,
                },
                event_attendees: {
                    some: {
                        user_id: userId,
                    },
                },
            },
            include: {
                event_attendees: {
                    where: {
                        user_id: userId,
                    },
                    select: {
                        status: true,
                    },
                },
                creator: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                date: 'asc',
            },
            take: 5,
        });

        // Count total connections (accepted status)
        const totalConnections = await prisma.connection.count({
            where: {
                OR: [
                    { requesterId: userId, status: 'ACCEPTED' },
                    { addresseeId: userId, status: 'ACCEPTED' },
                ],
            },
        });

        // Count events attended (where user is an attendee with GOING status)
        const eventsAttended = await prisma.event_attendees.count({
            where: {
                user_id: userId,
                status: 'GOING',
            },
        });

        return {
            user: {
                name: `${user.firstName} ${user.lastName}`,
                city: user.city || 'N/A',
                chapter: user.chapter?.name || 'No Chapter',
            },
            stats: {
                referralsGiven: referralsGivenStats._count,
                referralsReceived: referralsReceivedStats._count,
                meetingsAttended: eventsAttended,
                connections: totalConnections,
            },
            upcomingEvents: upcomingEvents.map(event => ({
                id: event.id,
                title: event.title,
                date: event.date.toISOString(),
                endDate: event.endDate?.toISOString(),
                type: event.type,
                location: event.location || undefined,
                virtualLink: event.virtualLink || undefined,
                isVirtual: event.isVirtual,
                rsvpStatus: event.event_attendees[0]?.status || 'INVITED',
                creatorName: `${event.creator.firstName} ${event.creator.lastName}`,
            })),
            profileCompletion,
        };
    },

    // Calculate profile completion percentage
    calculateProfileCompletion(user: any): number {
        if (!user) return 0;

        const fields = [
            user.firstName,
            user.lastName,
            user.email,
            user.company,
            user.position,
            user.city,
            user.bio,
            user.interests,
            user.chapterId,
        ];

        const filledFields = fields.filter(field => field && field.length > 0).length;
        return Math.round((filledFields / fields.length) * 100);
    },
};
