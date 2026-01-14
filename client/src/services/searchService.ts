import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/users/search`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { q: query },
        });
        return response.data.data.users;
    },
};

export default searchService;
