import React, { useState } from "react";
import TopBar from '../components/dashboard/TopBar';
import Sidebar from '../components/dashboard/Sidebar';
import Breadcrumb from '../components/common/Breadcrumb';
import { ArrowRight, CheckCircle } from 'lucide-react';

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
                setSuccess("Thank you! We'll get back to you shortly.");
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
        <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
            <TopBar />
            <div className="flex">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
                <main className="flex-1 p-4 sm:p-6 w-full">
                    <Breadcrumb items={breadcrumbItems} />

                    {/* Centered Container - Max Width 960px */}
                    <div className="flex justify-center" style={{ paddingTop: '32px' }}>
                        <div style={{ maxWidth: '960px', width: '100%' }}>
                            {/* Compact Header Section */}
                            <div className="text-center mb-8">
                                <h1 style={{
                                    fontSize: '36px',
                                    fontWeight: '700',
                                    color: '#111827',
                                    marginBottom: '8px',
                                    lineHeight: '1.2'
                                }}>
                                    Partner with Us
                                </h1>
                                <p style={{
                                    fontSize: '15px',
                                    color: '#6B7280',
                                    marginBottom: '0'
                                }}>
                                    Interested in partnering? Fill out the form below and we'll get in touch.
                                </p>
                            </div>

                            {/* Form Card */}
                            <div style={{
                                background: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '16px',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                                padding: '24px'
                            }}>
                                <form onSubmit={handleSubmit}>
                                    {/* Grid Layout */}
                                    <div style={{ display: 'grid', gap: '16px' }}>
                                        {/* Row 1: Full Name | Email */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-cols-1 md:grid-cols-2">
                                            {/* Full Name */}
                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: '#374151',
                                                    marginBottom: '6px'
                                                }}>
                                                    Full Name <span style={{ color: '#EF4444' }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="John Doe"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    style={{
                                                        width: '100%',
                                                        height: '44px',
                                                        padding: '0 14px',
                                                        border: '1px solid #D1D5DB',
                                                        borderRadius: '10px',
                                                        fontSize: '14px',
                                                        color: '#111827',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = '#6D28D9';
                                                        e.target.style.outline = 'none';
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(109, 40, 217, 0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = '#D1D5DB';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: '#374151',
                                                    marginBottom: '6px'
                                                }}>
                                                    Email <span style={{ color: '#EF4444' }}>*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="john@company.com"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    style={{
                                                        width: '100%',
                                                        height: '44px',
                                                        padding: '0 14px',
                                                        border: '1px solid #D1D5DB',
                                                        borderRadius: '10px',
                                                        fontSize: '14px',
                                                        color: '#111827',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = '#6D28D9';
                                                        e.target.style.outline = 'none';
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(109, 40, 217, 0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = '#D1D5DB';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Row 2: City | Company */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-cols-1 md:grid-cols-2">
                                            {/* City */}
                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: '#374151',
                                                    marginBottom: '6px'
                                                }}>
                                                    City / Location <span style={{ color: '#EF4444' }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    placeholder="Mumbai"
                                                    required
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    style={{
                                                        width: '100%',
                                                        height: '44px',
                                                        padding: '0 14px',
                                                        border: '1px solid #D1D5DB',
                                                        borderRadius: '10px',
                                                        fontSize: '14px',
                                                        color: '#111827',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = '#6D28D9';
                                                        e.target.style.outline = 'none';
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(109, 40, 217, 0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = '#D1D5DB';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>

                                            {/* Company */}
                                            <div>
                                                <label style={{
                                                    display: 'block',
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: '#374151',
                                                    marginBottom: '6px'
                                                }}>
                                                    Company / Business Name <span style={{ fontSize: '12px', color: '#9CA3AF' }}>(Optional)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="company"
                                                    placeholder="Company name"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                    style={{
                                                        width: '100%',
                                                        height: '44px',
                                                        padding: '0 14px',
                                                        border: '1px solid #D1D5DB',
                                                        borderRadius: '10px',
                                                        fontSize: '14px',
                                                        color: '#111827',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = '#6D28D9';
                                                        e.target.style.outline = 'none';
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(109, 40, 217, 0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = '#D1D5DB';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Row 3: Reason/Message - Full Width */}
                                        <div>
                                            <label style={{
                                                display: 'block',
                                                fontSize: '13px',
                                                fontWeight: '500',
                                                color: '#374151',
                                                marginBottom: '6px'
                                            }}>
                                                Reason / Message <span style={{ color: '#EF4444' }}>*</span>
                                            </label>
                                            <textarea
                                                name="reason"
                                                placeholder="Tell us about your partnership interest..."
                                                required
                                                value={formData.reason}
                                                onChange={handleChange}
                                                style={{
                                                    width: '100%',
                                                    minHeight: '140px',
                                                    padding: '12px 14px',
                                                    border: '1px solid #D1D5DB',
                                                    borderRadius: '10px',
                                                    fontSize: '14px',
                                                    color: '#111827',
                                                    resize: 'vertical',
                                                    fontFamily: 'inherit',
                                                    transition: 'all 0.2s'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#6D28D9';
                                                    e.target.style.outline = 'none';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(109, 40, 217, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = '#D1D5DB';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>

                                        {/* Success/Error Messages */}
                                        {success && (
                                            <div style={{
                                                background: 'rgba(5, 150, 105, 0.1)',
                                                border: '1px solid rgba(5, 150, 105, 0.2)',
                                                color: '#059669',
                                                padding: '12px 16px',
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <CheckCircle size={18} />
                                                {success}
                                            </div>
                                        )}

                                        {error && (
                                            <div style={{
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                color: '#DC2626',
                                                padding: '12px 16px',
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                ⚠ {error}
                                            </div>
                                        )}
                                    </div>

                                    {/* Form Footer - Helper Text Left, Button Right */}
                                    <div style={{
                                        marginTop: '24px',
                                        paddingTop: '24px',
                                        borderTop: '1px solid #F3F4F6',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '16px'
                                    }} className="flex-col sm:flex-row">
                                        <p style={{
                                            fontSize: '13px',
                                            color: '#6B7280',
                                            margin: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                                                <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5ZM8.75 11.25H7.25V7.25H8.75V11.25ZM8.75 5.75H7.25V4.25H8.75V5.75Z" fill="currentColor" />
                                            </svg>
                                            We typically respond within 24 hours
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                height: '44px',
                                                padding: '0 20px',
                                                background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #040008 0%, #270f4a 30%, #260c52 60%, #000000 100%)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                cursor: loading ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                transition: 'all 0.2s',
                                                whiteSpace: 'nowrap',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!loading) {
                                                    e.currentTarget.style.filter = 'brightness(1.2)';
                                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(38, 12, 82, 0.35)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!loading) {
                                                    e.currentTarget.style.filter = 'brightness(1)';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                                                }
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Submit
                                                    <ArrowRight size={16} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
