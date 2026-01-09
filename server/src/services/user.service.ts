import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    company?: string;
    position?: string;
    city?: string;
    bio?: string;
    interests?: string[];
}

export const userService = {
    // Get user profile by ID
    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                company: true,
                position: true,
                city: true,
                bio: true,
                interests: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    },

    // Update user profile
    async updateProfile(userId: string, data: UpdateProfileData) {
        const user = await prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                company: true,
                position: true,
                city: true,
                bio: true,
                interests: true,
                updatedAt: true
            }
        });

        return user;
    },

    // Get user by ID (for viewing other users)
    async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                company: true,
                position: true,
                city: true,
                bio: true,
                interests: true
            }
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }
};
