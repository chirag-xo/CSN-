import api from './api';

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
        city: string | null;
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
        const response = await api.post('/connections/request', { addresseeId, message });
        return response.data;
    },

    // Accept connection request
    async acceptRequest(connectionId: string) {
        const response = await api.patch(`/connections/${connectionId}/accept`);
        return response.data;
    },

    // Decline connection request
    async declineRequest(connectionId: string) {
        const response = await api.patch(`/connections/${connectionId}/decline`);
        return response.data;
    },

    // Remove connection
    async removeConnection(connectionId: string) {
        const response = await api.delete(`/connections/${connectionId}`);
        return response.data;
    },

    // Get connections list
    async getConnections(status: string = 'ACCEPTED', search?: string) {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (search) params.append('search', search);

        const response = await api.get(`/connections?${params.toString()}`);
        return { data: response.data.data.connections }; // Return connections array
    },

    // Get pending requests (received)
    async getPendingRequests() {
        const response = await api.get('/connections/pending');
        return response.data.data;
    },

    // Get sent requests
    async getSentRequests() {
        const response = await api.get('/connections/sent');
        return response.data.data;
    },

    // Get connection stats
    async getStats(): Promise<ConnectionStats> {
        const response = await api.get('/connections/stats');
        return response.data.data;
    },

    // Check connection status with specific user
    async getConnectionStatus(userId: string) {
        const response = await api.get(`/connections/status/${userId}`);
        return response.data.data;
    },
};

export default connectionService;
