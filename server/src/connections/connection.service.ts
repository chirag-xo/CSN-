import prisma from '../shared/database';
import { AppError, errorCodes } from '../shared/errors';

export const connectionService = {
    // Send connection request
    async sendRequest(requesterId: string, addresseeId: string, message?: string) {
        // Validation
        if (requesterId === addresseeId) {
            throw new AppError('Cannot connect to yourself', 400, 'INVALID_REQUEST');
        }

        // Check if addressee exists
        const addressee = await prisma.user.findUnique({ where: { id: addresseeId } });
        if (!addressee) {
            throw new AppError('User not found', 404, errorCodes.USER_NOT_FOUND);
        }

        // Check for existing connection
        const existing = await prisma.connection.findFirst({
            where: {
                OR: [
                    { requesterId, addresseeId },
                    { requesterId: addresseeId, addresseeId: requesterId },
                ],
            },
        });

        if (existing) {
            if (existing.status === 'BLOCKED') {
                throw new AppError('Cannot connect with this user', 403, 'BLOCKED');
            }
            if (existing.status === 'ACCEPTED') {
                throw new AppError('Already connected', 400, 'ALREADY_CONNECTED');
            }
            if (existing.status === 'PENDING') {
                throw new AppError('Connection request already sent', 400, 'REQUEST_PENDING');
            }
        }

        // Create connection request
        const connection = await prisma.connection.create({
            data: {
                requesterId,
                addresseeId,
                requestMessage: message,
                status: 'PENDING',
                lastActionBy: requesterId,
            },
        });

        return connection;
    },

    // Accept connection request
    async acceptRequest(connectionId: string, userId: string) {
        const connection = await prisma.connection.findUnique({
            where: { id: connectionId },
        });

        if (!connection) {
            throw new AppError('Connection not found', 404, 'CONNECTION_NOT_FOUND');
        }

        // Only addressee can accept
        if (connection.addresseeId !== userId) {
            throw new AppError('Not authorized', 403, 'UNAUTHORIZED');
        }

        if (connection.status !== 'PENDING') {
            throw new AppError('Connection not pending', 400, 'INVALID_STATUS');
        }

        const updated = await prisma.connection.update({
            where: { id: connectionId },
            data: {
                status: 'ACCEPTED',
                acceptedAt: new Date(),
                lastActionBy: userId,
            },
        });

        return updated;
    },

    // Decline connection request
    async declineRequest(connectionId: string, userId: string) {
        const connection = await prisma.connection.findUnique({
            where: { id: connectionId },
        });

        if (!connection) {
            throw new AppError('Connection not found', 404, 'CONNECTION_NOT_FOUND');
        }

        // Only addressee can decline
        if (connection.addresseeId !== userId) {
            throw new AppError('Not authorized', 403, 'UNAUTHORIZED');
        }

        if (connection.status !== 'PENDING') {
            throw new AppError('Connection not pending', 400, 'INVALID_STATUS');
        }

        const updated = await prisma.connection.update({
            where: { id: connectionId },
            data: {
                status: 'DECLINED',
                lastActionBy: userId,
            },
        });

        return updated;
    },

    // Remove connection (unfriend)
    async removeConnection(connectionId: string, userId: string) {
        const connection = await prisma.connection.findUnique({
            where: { id: connectionId },
        });

        if (!connection) {
            throw new AppError('Connection not found', 404, 'CONNECTION_NOT_FOUND');
        }

        // Must be part of the connection
        if (connection.requesterId !== userId && connection.addresseeId !== userId) {
            throw new AppError('Not authorized', 403, 'UNAUTHORIZED');
        }

        await prisma.connection.delete({
            where: { id: connectionId },
        });

        return { message: 'Connection removed' };
    },

    // Get user's connections
    async getConnections(userId: string, status: string = 'ACCEPTED', search?: string) {
        const where: any = {
            status,
            OR: [
                { requesterId: userId },
                { addresseeId: userId },
            ],
        };

        const connections = await prisma.connection.findMany({
            where,
            include: {
                requester: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                        company: true,
                        position: true,
                        city: true,
                    },
                },
                addressee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                        company: true,
                        position: true,
                        city: true,
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        // Map to get the "other" user
        const mapped = connections.map((conn) => {
            const otherUser = conn.requesterId === userId ? conn.addressee : conn.requester;
            return {
                id: conn.id,
                user: otherUser,
                connectedSince: conn.acceptedAt || conn.createdAt,
                status: conn.status,
            };
        });

        // Simple search filter
        if (search) {
            const filtered = mapped.filter((item) =>
                `${item.user.firstName} ${item.user.lastName}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
            return filtered;
        }

        return mapped;
    },

    // Get pending requests (received)
    async getPendingRequests(userId: string) {
        const requests = await prisma.connection.findMany({
            where: {
                addresseeId: userId,
                status: 'PENDING',
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                        company: true,
                        position: true,
                        city: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return requests.map((req) => ({
            id: req.id,
            requester: req.requester,
            message: req.requestMessage,
            createdAt: req.createdAt,
        }));
    },

    // Get sent requests
    async getSentRequests(userId: string) {
        const requests = await prisma.connection.findMany({
            where: {
                requesterId: userId,
                status: 'PENDING',
            },
            include: {
                addressee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                        company: true,
                        position: true,
                        city: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return requests.map((req) => ({
            id: req.id,
            addressee: req.addressee,
            status: req.status,
            createdAt: req.createdAt,
        }));
    },

    // Get connection stats
    async getStats(userId: string) {
        const [total, pendingReceived, pendingSent] = await Promise.all([
            prisma.connection.count({
                where: {
                    status: 'ACCEPTED',
                    OR: [{ requesterId: userId }, { addresseeId: userId }],
                },
            }),
            prisma.connection.count({
                where: {
                    addresseeId: userId,
                    status: 'PENDING',
                },
            }),
            prisma.connection.count({
                where: {
                    requesterId: userId,
                    status: 'PENDING',
                },
            }),
        ]);

        return {
            total,
            pendingReceived,
            pendingSent,
        };
    },

    // Check connection status between two users
    async getConnectionStatus(userId: string, otherUserId: string) {
        const connection = await prisma.connection.findFirst({
            where: {
                OR: [
                    { requesterId: userId, addresseeId: otherUserId },
                    { requesterId: otherUserId, addresseeId: userId },
                ],
            },
        });

        if (!connection) {
            return { status: 'NONE', connectionId: null };
        }

        const isPending = connection.status === 'PENDING';
        const isSentByMe = connection.requesterId === userId;

        return {
            status: connection.status,
            connectionId: connection.id,
            isPending,
            isSentByMe,
        };
    },
};
