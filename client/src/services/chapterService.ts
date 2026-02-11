import api from './api';

export interface Chapter {
    id: string;
    name: string;
    city: string;
    state?: string;
    cityId?: string;
    stateId?: string;
}

export const chapterService = {
    // Get all chapters with optional filtering
    async getChapters(cityId?: string, state?: string): Promise<Chapter[]> {
        const params: any = {};
        if (cityId) params.cityId = cityId;
        if (state) params.state = state;

        const response = await api.get('/public/chapters', { params });
        return response.data.data;
    },
};

export default chapterService;
