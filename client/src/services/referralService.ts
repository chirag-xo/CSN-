import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// TypeScript Interfaces
export interface Referral {
    id: string;
    fromUserId: string;
    toUserId: string;
    type: 'BUSINESS' | 'INTRO' | 'SUPPORT';
    description: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    businessValue?: number;
    status: 'PENDING' | 'CONVERTED' | 'CLOSED';
    notes?: string;
    createdAt: string;
    updatedAt: string;
    fromUser?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        company?: string;
        position?: string;
    };
    toUser?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        company?: string;
        position?: string;
    };
}

export interface CreateReferralData {
    toUserId: string;
    type: 'BUSINESS' | 'INTRO' | 'SUPPORT';
    description: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    businessValue?: number;
}

export interface UpdateStatusData {
    status: 'PENDING' | 'CONVERTED' | 'CLOSED';
    businessValue?: number;
    notes?: string;
}

const referralService = {
    // Get referrals given by user (with pagination)
    async getReferralsGiven(limit: number = 10, offset: number = 0) {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/referrals/given`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit, offset },
        });
        return response.data;
    },

    // Get referrals received by user (with pagination)
    async getReferralsReceived(limit: number = 10, offset: number = 0) {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/referrals/received`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit, offset },
        });
        return response.data;
    },

    // Create a new referral
    async createReferral(data: CreateReferralData) {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/api/referrals`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Update referral status
    async updateStatus(referralId: string, data: UpdateStatusData) {
        const token = localStorage.getItem('token');
        const response = await axios.patch(
            `${API_URL}/api/referrals/${referralId}/status`,
            data,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    },
};

export default referralService;
