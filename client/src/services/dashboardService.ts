import api from './api';

// Export types
export interface DashboardSummary {
    user: {
        name: string;
        city: string;
        chapter: string;
    };
    stats: {
        referralsGiven: number;
        referralsReceived: number;
        meetingsAttended: number;
        testimonials: number;
    };
    upcomingEvents: any[];
    profileCompletion: number;
}

export interface Referral {
    id: string;
    fromUserId: string;
    toUserId: string;
    description: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    businessValue?: number;
    status: 'PENDING' | 'CONVERTED' | 'CLOSED';
    createdAt: string;
    updatedAt: string;
    fromUser?: any;
    toUser?: any;
}

export interface CreateReferralData {
    toUserId: string;
    description: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    businessValue?: number;
}

// Dashboard service methods
export const dashboardService = {
    // Get dashboard summary
    async getSummary(): Promise<DashboardSummary> {
        const response = await api.get('/dashboard/summary');
        return response.data.data;
    },

    // Get referrals given
    async getReferralsGiven(): Promise<Referral[]> {
        const response = await api.get('/referrals/given');
        return response.data.data;
    },

    // Get referrals received
    async getReferralsReceived(): Promise<Referral[]> {
        const response = await api.get('/referrals/received');
        return response.data.data;
    },

    // Create referral
    async createReferral(data: CreateReferralData): Promise<Referral> {
        const response = await api.post('/referrals', data);
        return response.data.data;
    },

    // Update referral status
    async updateReferralStatus(
        referralId: string,
        status: 'PENDING' | 'CONVERTED' | 'CLOSED',
        businessValue?: number,
        notes?: string
    ): Promise<Referral> {
        const response = await api.patch(`/referrals/${referralId}/status`, {
            status,
            businessValue,
            notes
        });
        return response.data.data;
    }
};

// Default export
export default dashboardService;
