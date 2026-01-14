import api from './api';

// Types
export interface PrivacySettings {
    id: string;
    userId: string;
    emailVisibility: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
    phoneVisibility: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
    eventsVisibility: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
    interestsVisibility: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
    activityVisibility: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
}

export interface UpdatePrivacyData {
    emailVisibility?: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
    phoneVisibility?: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
    eventsVisibility?: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
    interestsVisibility?: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
    activityVisibility?: 'PUBLIC' | 'CONNECTIONS' | 'PRIVATE';
}

// Privacy service methods
export const privacyService = {
    // Get privacy settings
    async getSettings(): Promise<PrivacySettings> {
        const response = await api.get('/privacy');
        return response.data.data;
    },

    // Update privacy settings
    async updateSettings(data: UpdatePrivacyData): Promise<PrivacySettings> {
        const response = await api.put('/privacy', data);
        return response.data.data;
    },
};

export default privacyService;
