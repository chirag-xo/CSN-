import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Connection {
    id: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        company: string | null;
        position: string | null;
        city: string | null;
    };
    connectedSince: string;
    status: string;
}

export interface ConnectionRequest {
    id: string;
    requester?: {
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        company: string | null;
        position: string | null;
        city: string | null;
    };
    addressee?: {
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        company: string | null;
        position: string | null;
    };
    message?: string | null;
    status?: string;
    createdAt: string;
}

export interface ConnectionStats {
    total: number;
    pendingReceived: number;
    pendingSent: number;
}

const connectionService = {
    // Send connection request
    async sendRequest(addresseeId: string, message?: string) {
        const response = await axios.post(
            `${API_URL}/api/connections/request`,
            { addresseeId, message },
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // Accept connection request
    async acceptRequest(connectionId: string) {
        const response = await axios.patch(
            `${API_URL}/api/connections/${connectionId}/accept`,
            {},
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // Decline connection request
    async declineRequest(connectionId: string) {
        const response = await axios.patch(
            `${API_URL}/api/connections/${connectionId}/decline`,
            {},
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // Remove connection
    async removeConnection(connectionId: string) {
        const response = await axios.delete(
            `${API_URL}/api/connections/${connectionId}`,
            { headers: getAuthHeader() }
        );
        return response.data;
    },

    // Get connections list
    async getConnections(status: string = 'ACCEPTED', search?: string) {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (search) params.append('search', search);

        const response = await axios.get(
            `${API_URL}/api/connections?${params.toString()}`,
            { headers: getAuthHeader() }
        );
        return { data: response.data.data.connections }; // Return connections array
    },

    // Get pending requests (received)
    async getPendingRequests() {
        const response = await axios.get(
            `${API_URL}/api/connections/pending`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    },

    // Get sent requests
    async getSentRequests() {
        const response = await axios.get(
            `${API_URL}/api/connections/sent`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    },

    // Get connection stats
    async getStats(): Promise<ConnectionStats> {
        const response = await axios.get(
            `${API_URL}/api/connections/stats`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    },

    // Check connection status with specific user
    async getConnectionStatus(userId: string) {
        const response = await axios.get(
            `${API_URL}/api/connections/status/${userId}`,
            { headers: getAuthHeader() }
        );
        return response.data.data;
    },
};

export default connectionService;
