import React, { useState } from "react";
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';
import Breadcrumb from '../components/common/Breadcrumb';

export default function ContactUs() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        city: "",
        company: "",
        reason: "",
    });

    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState("");
    const [error, setError] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    access_key: import.meta.env.VITE_WEB3FORMS_KEY,
                    subject: "New Partnership Inquiry - CSN Dashboard",
                    from_name: "CSN Partnership Form",
                    name: formData.name,
                    email: formData.email,
                    city: formData.city,
                    company: formData.company || "Not specified",
                    message: formData.reason,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess("We'll get back to you shortly.");
                setFormData({ name: "", email: "", city: "", company: "", reason: "" });
            } else {
                setError(data.message || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Failed to submit form. Check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbItems = [
        { label: 'Partner with Us' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />
            <div className="flex">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
                <main className="flex-1 p-4 sm:p-6 w-full">
                    <Breadcrumb items={breadcrumbItems} />

                    <div className="mt-6 mb-8 text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Partner with Us</h1>
                        <p className="text-sm sm:text-base text-gray-600">Interested in partnering? Send us your details and we'll get in touch.</p>
                    </div>

                    {/* Centered form container */}
                    <div className="flex justify-center items-start">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8 w-full max-w-2xl">
                            <form className="contact-form space-y-4" onSubmit={handleSubmit}>
                                <div className="contact-field space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 text-center block">Full Name</label>
                                    <input
                                        className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-base text-center"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="contact-field space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 text-center block">Email</label>
                                    <input
                                        className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-base text-center"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="contact-field space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 text-center block">City / Location</label>
                                    <input
                                        className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-base text-center"
                                        type="text"
                                        name="city"
                                        placeholder="Enter your city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="contact-field space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 text-center block">Company / Business Name <span className="text-gray-400 text-xs">(Optional)</span></label>
                                    <input
                                        className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-base text-center"
                                        type="text"
                                        name="company"
                                        placeholder="Enter your company name"
                                        value={formData.company}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="contact-field space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 text-center block">Reason / Message</label>
                                    <textarea
                                        className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all min-h-[150px] resize-none text-base text-center"
                                        name="reason"
                                        placeholder="Write your message here..."
                                        required
                                        value={formData.reason}
                                        onChange={handleChange}
                                    />
                                </div>

                                {success && (
                                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center">
                                        <span className="mr-2">✓</span> {success}
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center">
                                        <span className="mr-2">⚠</span> {error}
                                    </div>
                                )}

                                <button
                                    className="w-full py-3 px-6 bg-[#6D28D9] hover:bg-[#5b21b6] text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-4"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : "Submit →"}
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
