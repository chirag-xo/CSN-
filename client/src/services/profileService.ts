import api from './api';

// Types
export interface Profile {
    id: string;
    email: string | null;
    firstName: string;
    lastName: string;
    company: string | null;
    position: string | null;
    city: string | null;
    phone: string | null;
    profilePhoto: string | null;
    tagline: string | null;
    bio: string | null;
    emailVerified: boolean;
    communityVerified: boolean;
    chapter: {
        id: string;
        name: string;
        city: string;
    } | null;
    interests: UserInterest[];
    skills: string[];
    topProjectTitle: string | null;
    topProjectDescription: string | null;
    topConnectionIds: string[];
    verificationCount: number;
    verifiedBy: Array<{
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
    }>;
    testimonials: any[];
    createdAt: string;
}

export interface UserInterest {
    id: string;
    interest: {
        id: string;
        name: string;
        category: {
            id: string;
            name: string;
            type: string;
        };
    };
    visibility: string;
}

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    company?: string;
    position?: string;
    city?: string;
    phone?: string;
    bio?: string;
    tagline?: string;
    skills?: string[];
    chapterId?: string;
    topProjectTitle?: string;
    topProjectDescription?: string;
    topConnectionIds?: string[];
}

// Profile service methods
export const profileService = {
    // Get user profile
    async getProfile(userId?: string): Promise<Profile> {
        const endpoint = userId ? `/profile/${userId}` : '/profile';
        const response = await api.get(endpoint);
        return response.data.data;
    },

    // Update own profile
    async updateProfile(data: UpdateProfileData): Promise<Profile> {
        const response = await api.put('/profile', data);
        return response.data.data;
    },

    // Get profile completion
    async getCompletion() {
        const response = await api.get('/profile/completion');
        return response.data; // Return full response for flexible parsing
    },
};

export default profileService;
