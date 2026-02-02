import api from './api';

export interface SearchResult {
    id: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string | null;
    company?: string | null;
    position?: string | null;
    city?: string | null;
    connectionStatus: 'CONNECTED' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'NONE';
}

const searchService = {
    // Search users
    async searchUsers(query: string): Promise<SearchResult[]> {
        const response = await api.get('/users/search', {
            params: { q: query },
        });
        return response.data.data.users;
    },
};

export default searchService;
