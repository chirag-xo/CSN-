import api from './api';

// Types
export interface InterestCategory {
    id: string;
    name: string;
    type: string;
    interests: Interest[];
}

export interface Interest {
    id: string;
    name: string;
    categoryId: string;
}

export interface UserInterest {
    id: string;
    interest: Interest & {
        category: {
            id: string;
            name: string;
            type: string;
        };
    };
    visibility: string;
    createdAt: string;
}

export interface AddInterestData {
    interestId: string;
    visibility?: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
}

// Interests service methods
export const interestsService = {
    // Get all available interests grouped by category
    async getAllInterests(): Promise<InterestCategory[]> {
        const response = await api.get('/interests');
        return response.data.data;
    },

    // Get current user's interests
    async getMyInterests(): Promise<UserInterest[]> {
        const response = await api.get('/interests/me');
        return response.data.data;
    },

    // Add interest
    async addInterest(data: AddInterestData): Promise<UserInterest> {
        const response = await api.post('/interests', data);
        return response.data.data;
    },

    // Remove interest
    async removeInterest(userInterestId: string): Promise<void> {
        await api.delete(`/interests/${userInterestId}`);
    },

    // Update interest visibility
    async updateVisibility(
        userInterestId: string,
        visibility: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE'
    ): Promise<UserInterest> {
        const response = await api.patch(`/interests/${userInterestId}/visibility`, { visibility });
        return response.data.data;
    },
};

export default interestsService;
