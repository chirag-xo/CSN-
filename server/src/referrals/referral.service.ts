import { z } from 'zod';
import prisma from '../shared/database';
import { AppError, errorCodes } from '../shared/errors';

// Validation schemas
export const createReferralSchema = z.object({
    toUserId: z.string().uuid('Invalid user ID'),
    type: z.enum(['BUSINESS', 'INTRO', 'SUPPORT']).default('BUSINESS'),
    description: z.string().min(1, 'Description is required'),
    contactName: z.string().optional(),
    contactEmail: z.string().email().optional(),
    contactPhone: z.string().optional(),
    businessValue: z.number().positive().optional(),
});

export const updateStatusSchema = z.object({
    status: z.enum(['PENDING', 'CONVERTED', 'CLOSED']),
    businessValue: z.number().positive().optional(),
    notes: z.string().optional(),
});

export const referralService = {
    // Get referrals given by user
    async getReferralsGiven(userId: string) {
        const referrals = await prisma.referral.findMany({
            where: { fromUserId: userId },
            include: {
                toUser: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        company: true,
                        position: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return referrals;
    },

    // Get referrals received by user
    async getReferralsReceived(userId: string) {
        const referrals = await prisma.referral.findMany({
            where: { toUserId: userId },
            include: {
                fromUser: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        company: true,
                        position: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return referrals;
    },

    // Create referral with validation
    async createReferral(fromUserId: string, data: z.infer<typeof createReferralSchema>) {
        // Validate input
        const validatedData = createReferralSchema.parse(data);

        // Prevent self-referral
        if (fromUserId === validatedData.toUserId) {
            throw new AppError(
                'You cannot refer yourself',
                400,
                errorCodes.SELF_REFERRAL_NOT_ALLOWED
            );
        }

        // Check if toUser exists
        const toUser = await prisma.user.findUnique({
            where: { id: validatedData.toUserId },
        });

        if (!toUser) {
            throw new AppError('Recipient user not found', 404, errorCodes.USER_NOT_FOUND);
        }

        // Check for duplicate referral (same users within 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const existingReferral = await prisma.referral.findFirst({
            where: {
                fromUserId,
                toUserId: validatedData.toUserId,
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
        });

        if (existingReferral) {
            throw new AppError(
                'You already created a referral to this user within the last 7 days',
                400,
                errorCodes.DUPLICATE_REFERRAL
            );
        }

        // Create referral
        const referral = await prisma.referral.create({
            data: {
                fromUserId,
                toUserId: validatedData.toUserId,
                type: validatedData.type,
                description: validatedData.description,
                contactName: validatedData.contactName,
                contactEmail: validatedData.contactEmail,
                contactPhone: validatedData.contactPhone,
                businessValue: validatedData.businessValue,
            },
            include: {
                toUser: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        company: true,
                        position: true,
                    },
                },
            },
        });

        return referral;
    },

    // Update referral status with authorization
    async updateReferralStatus(
        referralId: string,
        userId: string,
        data: z.infer<typeof updateStatusSchema>
    ) {
        // Validate input
        const validatedData = updateStatusSchema.parse(data);

        // Get referral
        const referral = await prisma.referral.findUnique({
            where: { id: referralId },
        });

        if (!referral) {
            throw new AppError('Referral not found', 404, errorCodes.REFERRAL_NOT_FOUND);
        }

        // Authorization: Only the recipient (toUser) can mark as CONVERTED or CLOSED
        if (referral.toUserId !== userId) {
            throw new AppError(
                'Only the referral recipient can update its status',
                403,
                errorCodes.UNAUTHORIZED_STATUS_UPDATE
            );
        }

        // Update referral
        const updatedReferral = await prisma.referral.update({
            where: { id: referralId },
            data: {
                status: validatedData.status,
                businessValue: validatedData.businessValue ?? referral.businessValue,
                notes: validatedData.notes,
            },
            include: {
                fromUser: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        company: true,
                        position: true,
                    },
                },
                toUser: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        company: true,
                        position: true,
                    },
                },
            },
        });

        return updatedReferral;
    },
};
