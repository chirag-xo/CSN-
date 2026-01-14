import { z } from 'zod';
import prisma from '../shared/database';
import { AppError, errorCodes } from '../shared/errors';

export const updatePrivacySchema = z.object({
    emailVisibility: z.enum(['PUBLIC', 'CONNECTIONS', 'PRIVATE']).optional(),
    phoneVisibility: z.enum(['PUBLIC', 'CONNECTIONS', 'PRIVATE']).optional(),
    eventsVisibility: z.enum(['PUBLIC', 'CONNECTIONS', 'PRIVATE']).optional(),
    interestsVisibility: z.enum(['PUBLIC', 'CONNECTIONS', 'PRIVATE']).optional(),
    activityVisibility: z.enum(['PUBLIC', 'CONNECTIONS', 'PRIVATE']).optional(),
});

export const privacyService = {
    // Get user privacy settings
    async getPrivacySettings(userId: string) {
        let privacy = await prisma.userPrivacy.findUnique({
            where: { userId },
        });

        // Create default privacy settings if they don't exist
        if (!privacy) {
            privacy = await prisma.userPrivacy.create({
                data: {
                    userId,
                    emailVisibility: 'PUBLIC',
                    phoneVisibility: 'PRIVATE',
                    eventsVisibility: 'CONNECTIONS',
                    interestsVisibility: 'PUBLIC',
                    activityVisibility: 'CONNECTIONS',
                },
            });
        }

        return privacy;
    },

    // Update privacy settings
    async updatePrivacySettings(userId: string, data: z.infer<typeof updatePrivacySchema>) {
        const validatedData = updatePrivacySchema.parse(data);

        // Ensure privacy settings exist
        await this.getPrivacySettings(userId);

        const updated = await prisma.userPrivacy.update({
            where: { userId },
            data: validatedData,
        });

        return updated;
    },

    // Check if viewer can see field based on privacy settings
    async canView(viewerId: string | null, targetUserId: string, fieldVisibility: string): Promise<boolean> {
        // Owner can always see their own data
        if (viewerId === targetUserId) {
            return true;
        }

        // PUBLIC is visible to everyone
        if (fieldVisibility === 'PUBLIC') {
            return true;
        }

        // PRIVATE is only visible to owner
        if (fieldVisibility === 'PRIVATE') {
            return false;
        }

        // CONNECTIONS requires being connected
        // TODO: Implement connection checking when connection feature is built
        // For now, return false for non-owner viewers
        return false;
    },
};
