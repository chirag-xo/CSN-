import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ContactFormData {
    name: string;
    email: string;
    reason: string;
}

export const contactService = {
    async submitContactForm(data: ContactFormData) {
        const response = await axios.post(`${API_URL}/api/contact`, data);
        return response.data;
    }
};
