import { z } from 'zod';
import prisma from '../shared/database';
import { AppError, errorCodes } from '../shared/errors';

// Validation schemas
export const addInterestSchema = z.object({
    interestId: z.string().uuid('Invalid interest ID'),
    visibility: z.enum(['PUBLIC', 'CONNECTIONS', 'PRIVATE']).optional().default('PUBLIC'),
});

export const interestService = {
    // Get all available interests grouped by category
    async getAllInterests() {
        const categories = await prisma.interestCategory.findMany({
            include: {
                interests: {
                    orderBy: { name: 'asc' },
                },
            },
            orderBy: { type: 'asc' },
        });

        return categories;
    },

    // Get user's interests
    async getUserInterests(userId: string) {
        const userInterests = await prisma.userInterest.findMany({
            where: { userId },
            include: {
                interest: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        return userInterests.map(ui => ({
            id: ui.id,
            interest: ui.interest,
            visibility: ui.visibility,
            createdAt: ui.createdAt,
        }));
    },

    // Add interest to user (max 5-7 check)
    async addInterest(userId: string, data: z.infer<typeof addInterestSchema>) {
        const validatedData = addInterestSchema.parse(data);

        // Check current interest count
        const currentCount = await prisma.userInterest.count({
            where: { userId },
        });

        if (currentCount >= 7) {
            throw new AppError('Maximum 7 interests allowed per user', 400, errorCodes.VALIDATION_ERROR);
        }

        // Check if interest exists
        const interest = await prisma.interest.findUnique({
            where: { id: validatedData.interestId },
        });

        if (!interest) {
            throw new AppError('Interest not found', 404, 'INTEREST_NOT_FOUND');
        }

        // Check if user already has this interest
        const existing = await prisma.userInterest.findUnique({
            where: {
                userId_interestId: {
                    userId,
                    interestId: validatedData.interestId,
                },
            },
        });

        if (existing) {
            throw new AppError('Interest already added', 400, 'INTEREST_ALREADY_EXISTS');
        }

        // Add interest
        const userInterest = await prisma.userInterest.create({
            data: {
                userId,
                interestId: validatedData.interestId,
                visibility: validatedData.visibility,
            },
            include: {
                interest: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        return userInterest;
    },

    // Remove interest
    async removeInterest(userId: string, userInterestId: string) {
        const userInterest = await prisma.userInterest.findUnique({
            where: { id: userInterestId },
        });

        if (!userInterest) {
            throw new AppError('User interest not found', 404, 'USER_INTEREST_NOT_FOUND');
        }

        if (userInterest.userId !== userId) {
            throw new AppError('Not authorized to remove this interest', 403, errorCodes.UNAUTHORIZED);
        }

        await prisma.userInterest.delete({
            where: { id: userInterestId },
        });

        return { success: true };
    },

    // Update interest visibility
    async updateVisibility(userId: string, userInterestId: string, visibility: string) {
        const userInterest = await prisma.userInterest.findUnique({
            where: { id: userInterestId },
        });

        if (!userInterest) {
            throw new AppError('User interest not found', 404, 'USER_INTEREST_NOT_FOUND');
        }

        if (userInterest.userId !== userId) {
            throw new AppError('Not authorized to update this interest', 403, errorCodes.UNAUTHORIZED);
        }

        const updated = await prisma.userInterest.update({
            where: { id: userInterestId },
            data: { visibility },
            include: {
                interest: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        return updated;
    },
};
