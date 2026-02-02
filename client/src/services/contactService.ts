import api from './api';

export interface ContactFormData {
    name: string;
    email: string;
    reason: string;
}

export const contactService = {
    async submitContactForm(data: ContactFormData) {
        const response = await api.post('/contact', data);
        return response.data;
    }
};
