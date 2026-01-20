import api from './api';

export interface Chapter {
    id: string;
    name: string;
    city: string;
}

export const chapterService = {
    // Get all chapters
    async getChapters(): Promise<Chapter[]> {
        const response = await api.get('/chapters');
        return response.data.data;
    },
};

export default chapterService;
