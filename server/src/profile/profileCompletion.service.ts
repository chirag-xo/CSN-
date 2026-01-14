import prisma from '../shared/database';

interface ProfileCompletionItem {
    key: string;
    label: string;
    points: number;
    completed: boolean;
    route?: string;
}

interface MissingItem {
    key: string;
    label: string;
    points: number;
    route?: string;
}

interface ProfileCompletionResult {
    completionPercentage: number;
    totalPoints: number;
    earnedPoints: number;
    completed: string[];
    missing: MissingItem[];
    suggestions: string[];
}

export const profileCompletionService = {
    async calculate(userId: string): Promise<ProfileCompletionResult> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                interests: true,
                sentConnections: {
                    where: { status: 'ACCEPTED' },
                    take: 1,
                },
                receivedConnections: {
                    where: { status: 'ACCEPTED' },
                    take: 1,
                },
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const hasConnection = user.sentConnections.length > 0 || user.receivedConnections.length > 0;

        const checklist: ProfileCompletionItem[] = [
            {
                key: 'profilePicture',
                label: 'Profile Picture',
                points: 15,
                completed: !!user.profilePhoto,
                route: '/dashboard/profile?section=basic',
            },
            {
                key: 'fullName',
                label: 'Full Name',
                points: 10,
                completed: !!(user.firstName && user.lastName),
                route: '/dashboard/profile?section=basic',
            },
            {
                key: 'bio',
                label: 'Bio',
                points: 10,
                completed: !!user.bio && user.bio.trim().length > 0,
                route: '/dashboard/profile?section=about',
            },
            {
                key: 'companyPosition',
                label: 'Company + Position',
                points: 10,
                completed: !!(user.company && user.position),
                route: '/dashboard/profile?section=business',
            },
            {
                key: 'city',
                label: 'City',
                points: 5,
                completed: !!user.city && user.city.trim().length > 0,
                route: '/dashboard/profile?section=basic',
            },
            {
                key: 'phoneVerified',
                label: 'Phone Verified',
                points: 10,
                completed: user.phoneVerified || false,
                route: '/dashboard/profile?section=privacy',
            },
            {
                key: 'emailVerified',
                label: 'Email Verified',
                points: 10,
                completed: user.emailVerified,
                route: '/dashboard/profile?section=privacy',
            },
            {
                key: 'interests',
                label: 'Interests (min 3)',
                points: 15,
                completed: user.interests.length >= 3,
                route: '/dashboard/profile?section=interests',
            },
            {
                key: 'socialLinks',
                label: 'Social Links',
                points: 10,
                completed: !!user.socialLinks,
                route: '/dashboard/profile?section=social',
            },
            {
                key: 'firstConnection',
                label: 'First Connection',
                points: 5,
                completed: hasConnection,
                route: '/dashboard/home/connections',
            },
        ];

        const completed = checklist.filter(item => item.completed);
        const missing = checklist.filter(item => !item.completed);

        const totalPoints = checklist.reduce((sum, item) => sum + item.points, 0);
        const earnedPoints = completed.reduce((sum, item) => sum + item.points, 0);
        const percentage = Math.round((earnedPoints / totalPoints) * 100);

        return {
            completionPercentage: percentage,
            totalPoints,
            earnedPoints,
            completed: completed.map(item => item.key),
            missing: missing.map(({ key, label, points, route }) => ({
                key,
                label,
                points,
                route,
            })),
            suggestions: this.generateSuggestions(missing),
        };
    },

    generateSuggestions(missing: ProfileCompletionItem[]): string[] {
        const suggestions: string[] = [];

        if (missing.find(item => item.key === 'profilePicture')) {
            suggestions.push('Add a profile picture to boost trust');
        }
        if (missing.find(item => item.key === 'interests')) {
            suggestions.push('Add at least 3 interests to improve discovery');
        }
        if (missing.find(item => item.key === 'bio')) {
            suggestions.push('Write a bio to help others understand your business');
        }
        if (missing.find(item => item.key === 'companyPosition')) {
            suggestions.push('Complete your company and position details');
        }
        if (missing.find(item => item.key === 'firstConnection')) {
            suggestions.push('Make your first connection to start networking');
        }

        return suggestions;
    },
};
