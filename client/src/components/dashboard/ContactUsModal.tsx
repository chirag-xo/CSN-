import { useState } from 'react';
import { contactService, type ContactFormData } from '../../services/contactService';

interface ContactUsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactUsModal({ isOpen, onClose }: ContactUsModalProps) {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        reason: ''
    });
    const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (formData.name.length < 2) return 'Name must be at least 2 characters';
        if (!formData.email.includes('@')) return 'Invalid email address';
        if (formData.reason.length < 10) return 'Reason must be at least 10 characters';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setStatus('SUBMITTING');
            setError('');
            await contactService.submitContactForm(formData);
            setStatus('SUCCESS');
            setTimeout(() => {
                onClose();
                setStatus('IDLE');
                setFormData({ name: '', email: '', reason: '' });
            }, 2000);
        } catch (err: any) {
            setStatus('ERROR');
            setError(err.response?.data?.error || 'Failed to submit request');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h2>

                {status === 'SUCCESS' ? (
                    <div className="text-center py-8">
                        <div className="text-green-500 text-5xl mb-4">✓</div>
                        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                        <p className="text-gray-600">We'll get back to you shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Your Name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason
                            </label>
                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="How can we help you?"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'SUBMITTING'}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${status === 'SUBMITTING'
                                    ? 'bg-purple-400 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-700'
                                }`}
                        >
                            {status === 'SUBMITTING' ? 'Sending...' : 'Submit'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
