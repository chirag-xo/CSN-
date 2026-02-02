import api from './api';

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
    status?: 'PENDING' | 'CONVERTED' | 'CLOSED'; // Added to make it flexible if needed, though mostly used in update
}

export interface UpdateStatusData {
    status: 'PENDING' | 'CONVERTED' | 'CLOSED';
    businessValue?: number;
    notes?: string;
}

const referralService = {
    // Get referrals given by user (with pagination)
    async getReferralsGiven(limit: number = 10, offset: number = 0) {
        const response = await api.get('/referrals/given', {
            params: { limit, offset },
        });
        return response.data;
    },

    // Get referrals received by user (with pagination)
    async getReferralsReceived(limit: number = 10, offset: number = 0) {
        const response = await api.get('/referrals/received', {
            params: { limit, offset },
        });
        return response.data;
    },

    // Create a new referral
    async createReferral(data: CreateReferralData) {
        const response = await api.post('/referrals', data);
        return response.data;
    },

    // Update referral status
    async updateStatus(referralId: string, data: UpdateStatusData) {
        const response = await api.patch(
            `/referrals/${referralId}/status`,
            data
        );
        return response.data;
    },
};

export default referralService;
