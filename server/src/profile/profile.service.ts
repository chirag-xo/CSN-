import { z } from 'zod';
import prisma from '../shared/database';
import { AppError, errorCodes } from '../shared/errors';
import { privacyService } from '../privacy/privacy.service';

export const updateProfileSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    company: z.string().optional(),
    position: z.string().optional(),
    city: z.string().optional(),
    phone: z.string().optional(),
    bio: z.string().optional(),
    tagline: z.string().optional(),
    chapterId: z.string().uuid().optional(),
    topProjectTitle: z.string().optional(),
    topProjectDescription: z.string().optional(),
    topConnectionIds: z.array(z.string()).optional(),
});

export const profileService = {
    // Get user profile with privacy filtering
    async getProfile(targetUserId: string, viewerId?: string) {
        const user = await prisma.user.findUnique({
            where: { id: targetUserId },
            include: {
                chapter: true,
                interests: {
                    include: {
                        interest: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
                privacy: true,
                verifications: {
                    include: {
                        verifier: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profilePhoto: true,
                            },
                        },
                    },
                },
                testimonialsReceived: {
                    where: { visibility: 'PUBLIC' },
                    include: {
                        fromUser: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profilePhoto: true,
                            },
                        },
                    },
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!user) {
            throw new AppError('User not found', 404, errorCodes.USER_NOT_FOUND);
        }

        // Get privacy settings
        const privacy = user.privacy || await privacyService.getPrivacySettings(targetUserId);

        // Filter based on privacy settings
        const canViewEmail = await privacyService.canView(viewerId || null, targetUserId, privacy.emailVisibility);
        const canViewPhone = await privacyService.canView(viewerId || null, targetUserId, privacy.phoneVisibility);
        const canViewInterests = await privacyService.canView(viewerId || null, targetUserId, privacy.interestsVisibility);

        // Build response
        const profile = {
            id: user.id,
            email: canViewEmail ? user.email : null,
            firstName: user.firstName,
            lastName: user.lastName,
            company: user.company,
            position: user.position,
            city: user.city,
            phone: canViewPhone ? user.phone : null,
            profilePhoto: user.profilePhoto,
            tagline: user.tagline,
            bio: user.bio,
            emailVerified: user.emailVerified,
            communityVerified: user.communityVerified,
            // Showcase
            topProjectTitle: user.topProjectTitle,
            topProjectDescription: user.topProjectDescription,
            topConnectionIds: user.topConnectionIds,
            chapter: user.chapter ? {
                id: user.chapter.id,
                name: user.chapter.name,
                city: user.chapter.city,
            } : null,
            interests: canViewInterests ? user.interests.map(ui => ({
                id: ui.id,
                interest: ui.interest,
                visibility: ui.visibility,
            })) : [],
            verificationCount: user.verifications.length,
            verifiedBy: user.verifications.slice(0, 3).map(v => v.verifier),
            testimonials: user.testimonialsReceived,
            createdAt: user.createdAt,
        };

        return profile;
    },

    // Get public profile with enhanced grouped structure and viewer context
    async getPublicProfile(userId: string, viewerId?: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                interests: {
                    include: {
                        interest: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
                chapter: true,
                privacy: true,
                verifications: {
                    include: {
                        verifier: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profilePhoto: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new AppError('User not found', 404, errorCodes.USER_NOT_FOUND);
        }

        const privacy = user.privacy;
        const isOwnProfile = viewerId === userId;

        // Check if viewer has vouched for this user
        let hasVouched = false;
        if (viewerId && !isOwnProfile) {
            const existingVouch = await prisma.userVerification.findFirst({
                where: {
                    userId: userId,
                    verifiedBy: viewerId,
                },
            });
            hasVouched = !!existingVouch;
        }

        // Viewer can vouch if: logged in, not own profile, and verified
        const viewer = viewerId
            ? await prisma.user.findUnique({
                where: { id: viewerId },
                select: { emailVerified: true, communityVerified: true },
            })
            : null;

        const canVouch = !!(
            viewerId &&
            !isOwnProfile &&
            (viewer?.emailVerified || viewer?.communityVerified) &&
            !hasVouched
        );

        // Filter interests based on viewer relationship
        // Public viewer → PUBLIC only
        // Connected viewer → PUBLIC + CONNECTIONS (TODO: check connection status)
        // Owner → ALL
        // Check for existing connection status if viewer is logged in
        let isConnected = false;
        let connectionPending = false;

        if (viewerId && !isOwnProfile) {
            const connection = await prisma.connection.findFirst({
                where: {
                    OR: [
                        { requesterId: viewerId, addresseeId: userId },
                        { requesterId: userId, addresseeId: viewerId },
                    ],
                },
            });

            if (connection) {
                if (connection.status === 'ACCEPTED') {
                    isConnected = true;
                } else if (connection.status === 'PENDING') {
                    // Only show pending if viewer sent the request? 
                    // Or generically? ProfileActions handles "Request Sent" vs "Accept" usually.
                    // For now, let's treat any pending link as "pending" for the button state
                    connectionPending = true;
                }
            }
        }

        const filteredInterests = user.interests
            .filter((userInterest) => {
                const visibility = userInterest.visibility;

                // Owner sees all
                if (isOwnProfile) return true;

                // Connected viewers see PUBLIC and CONNECTIONS
                if (isConnected && (visibility === 'PUBLIC' || visibility === 'CONNECTIONS')) {
                    return true;
                }

                // Public viewers see only PUBLIC
                return visibility === 'PUBLIC';
            })
            .map((userInterest) => ({
                id: userInterest.interest.id,
                name: userInterest.interest.name,
                category: userInterest.interest.category.name,
                categoryType: userInterest.interest.category.type,
                visibility: userInterest.visibility,
            }));

        // Helper function for privacy checks
        const shouldShowField = (
            visibility: string | undefined,
            isOwn: boolean,
            isConn: boolean
        ): boolean => {
            if (isOwn) return true;
            if (!visibility) return false;
            if (visibility === 'PUBLIC') return true;
            if (visibility === 'CONNECTIONS' && isConn) return true;
            return false;
        };

        // Build grouped response
        return {
            basic: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                profilePhoto: user.profilePhoto,
                location: user.city,
            },
            professional: {
                company: user.company,
                position: user.position,
            },
            about: {
                tagline: user.tagline,
                bio: user.bio,
                memberSince: user.createdAt,
            },
            verification: {
                emailVerified: user.emailVerified,
                communityVerified: user.communityVerified,
                vouchCount: user.verifications.length,
            },
            interests: filteredInterests,
            chapter: user.chapter
                ? {
                    name: user.chapter.name,
                    city: user.chapter.city,
                }
                : null,
            contact: {
                email: shouldShowField(privacy?.emailVisibility, isOwnProfile, isConnected)
                    ? user.email
                    : null,
                phone: shouldShowField(privacy?.phoneVisibility, isOwnProfile, isConnected)
                    ? user.phone
                    : null,
            },
            viewerContext: {
                isOwnProfile,
                isConnected,
                connectionPending,
                hasVouched,
                canVouch,
            },
        };
    },

    // Update own profile
    async updateProfile(userId: string, data: z.infer<typeof updateProfileSchema>) {
        const validatedData = updateProfileSchema.parse(data);

        const updated = await prisma.user.update({
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
                phone: true,
                profilePhoto: true,
                tagline: true,
                bio: true,
                chapterId: true,
                createdAt: true,
                updatedAt: true,
                // Showcase
                topProjectTitle: true,
                topProjectDescription: true,
                topConnectionIds: true,
            },
        });

        return updated;
    },

    // Get profile completion percentage
    async getProfileCompletion(userId: string): Promise<number> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                interests: true,
            },
        });

        if (!user) return 0;

        const fields = [
            user.firstName,
            user.lastName,
            user.email,
            user.company,
            user.position,
            user.city,
            user.phone,
            user.bio,
            user.tagline,
            user.profilePhoto,
            user.chapterId,
            user.interests.length > 0 ? 'has interests' : null,
        ];

        const filledFields = fields.filter(field => field && field.length > 0).length;
        return Math.round((filledFields / fields.length) * 100);
    },
};
