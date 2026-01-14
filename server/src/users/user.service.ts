import { z } from 'zod';
import prisma from '../shared/database';
import { AppError, errorCodes } from '../shared/errors';
import { UserDTO } from '../shared/types';

// Validation schema
export const updateProfileSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    company: z.string().optional(),
    position: z.string().optional(),
    city: z.string().optional(),
    bio: z.string().optional(),
    chapterId: z.string().uuid().optional(),
});

export const userService = {
    // Update user profile (never expose password)
    async updateProfile(
        userId: string,
        data: z.infer<typeof updateProfileSchema>
    ): Promise<UserDTO> {
        // Validate input
        const validatedData = updateProfileSchema.parse(data);

        // Update user
        const user = await prisma.user.update({
            where: { id: userId },
            data: validatedData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                company: true,
                position: true,
                city: true,
                bio: true,
                chapterId: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user;
    },

    // Search users globally
    async searchUsers(currentUserId: string, query: string) {
        if (!query || query.length < 2) {
            return [];
        }

        // Use raw query to search across concatenated full name and other fields
        // SQLite's LIKE is case-insensitive by default for ASCII characters
        const searchPattern = `%${query}%`;

        const users = await prisma.$queryRaw<Array<{
            id: string;
            firstName: string;
            lastName: string;
            profilePhoto: string | null;
            company: string | null;
            position: string | null;
            city: string | null;
        }>>`
            SELECT id, firstName, lastName, profilePhoto, company, position, city
            FROM User
            WHERE id != ${currentUserId}
            AND (
                (firstName || ' ' || lastName) LIKE ${searchPattern}
                OR firstName LIKE ${searchPattern}
                OR lastName LIKE ${searchPattern}
                OR company LIKE ${searchPattern}
                OR position LIKE ${searchPattern}
                OR city LIKE ${searchPattern}
            )
            LIMIT 10
        `;

        // Get connection status for each user
        const resultsWithStatus = await Promise.all(
            users.map(async (user) => {
                const connectionStatus = await this.getConnectionStatus(currentUserId, user.id);
                return {
                    ...user,
                    connectionStatus,
                };
            })
        );

        return resultsWithStatus;
    },

    // Get connection status between two users
    async getConnectionStatus(userId: string, otherUserId: string) {
        const connection = await prisma.connection.findFirst({
            where: {
                OR: [
                    { requesterId: userId, addresseeId: otherUserId },
                    { requesterId: otherUserId, addresseeId: userId },
                ]
            }
        });

        if (!connection) {
            return 'NONE';
        }

        if (connection.status === 'ACCEPTED') {
            return 'CONNECTED';
        }

        if (connection.status === 'PENDING') {
            if (connection.requesterId === userId) {
                return 'PENDING_SENT';
            } else {
                return 'PENDING_RECEIVED';
            }
        }

        return 'NONE';
    },
};
