import React from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    // Brand gradient from sidebar.css
    const brandGradient = 'linear-gradient(135deg, #040008 0%, #270f4a 30%, #260c52 60%, #000000 100%)';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
            {/* Backdrop: Dark blur overlay rgba(0,0,0,0.55) + backdrop-filter: blur(6px) */}
            <div
                className="absolute inset-0 bg-black/55 backdrop-blur-[6px] transition-opacity duration-300"
                onClick={!isLoading ? onClose : undefined}
            />

            {/* Modal Container */}
            <div
                className="bg-white relative z-10 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200 flex flex-col"
                style={{
                    width: 'min(520px, 92vw)',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                }}
            >
                {/* Header Section */}
                <div
                    className="flex items-center justify-between relative"
                    style={{
                        background: brandGradient,
                        padding: '16px 20px',
                    }}
                >
                    <div className="flex items-center gap-3">
                        {/* Icon placeholder if needed, user said "Title aligned left with icon" but didn't specify which icon. 
                            Using AlertTriangle as per previous design but white. */}
                        <div className="text-white/90">
                            <AlertTriangle size={24} />
                        </div>
                        <h2
                            className="text-white m-0"
                            style={{
                                fontFamily: '"DM Sans", sans-serif',
                                fontWeight: 700,
                                fontSize: '22px',
                                lineHeight: '1.2',
                            }}
                        >
                            {title}
                        </h2>
                    </div>

                    {/* Close Button: Top-right, plain X icon */}
                    <button
                        onClick={!isLoading ? onClose : undefined}
                        className="flex items-center justify-center rounded-full text-white hover:text-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                        style={{
                            width: '32px',
                            height: '32px',
                            background: 'transparent',
                            border: 'none',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}
                        disabled={isLoading}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body Text */}
                <div
                    style={{
                        padding: '20px',
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '16px',
                        color: '#4B5563',
                        lineHeight: '1.5',
                    }}
                >
                    <p className="m-0">
                        {message}
                    </p>
                </div>

                {/* Action Buttons */}
                <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3"
                    style={{
                        padding: '0 20px 20px 20px',
                    }}
                >
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="order-2 sm:order-1 flex items-center justify-center transition-all hover:-translate-y-0.5"
                        style={{
                            height: '44px',
                            borderRadius: '12px',
                            background: '#ffffff',
                            border: '1px solid #E5E7EB',
                            color: '#374151',
                            fontWeight: 600,
                            fontSize: '15px',
                            padding: '0 20px',
                            opacity: isLoading ? 0.6 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="order-1 sm:order-2 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                        style={{
                            height: '44px',
                            borderRadius: '12px',
                            background: brandGradient,
                            border: 'none',
                            color: '#ffffff',
                            fontWeight: 600,
                            fontSize: '15px',
                            padding: '0 24px',
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
