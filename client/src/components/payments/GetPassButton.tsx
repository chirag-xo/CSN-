import React, { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface GetPassButtonProps {
    eventId: string;
    onSuccess?: () => void;
    className?: string;
    children?: React.ReactNode;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function GetPassButton({ eventId, onSuccess, className, children }: GetPassButtonProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (!user) {
            alert('Please login to get a pass');
            return;
        }

        try {
            setLoading(true);

            // 1. Create Order
            const { data } = await api.post('/payments/create-order', { eventId });

            // 2. Handle Free Event
            if (data.isFree) {
                alert('Free event — pass granted!');
                console.log('Free event — pass granted');
                if (onSuccess) onSuccess();
                return;
            }

            // 3. Handle Paid Event (Razorpay)
            if (!data.orderId) {
                throw new Error('Failed to create order');
            }

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "CSN Event",
                description: "Event Entry Pass",
                order_id: data.orderId,
                handler: async function (response: any) {
                    try {
                        // 4. Verify Payment
                        const verifyRes = await api.post('/payments/verify', {
                            eventId,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            alert('Payment successful!');
                            console.log('Payment successful');
                            if (onSuccess) onSuccess();
                        } else {
                            alert('Payment verification failed');
                        }
                    } catch (err) {
                        console.error('Verification error:', err);
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    contact: user.phone || ''
                },
                theme: {
                    color: "#6D28D9"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                alert(response.error.description);
                console.error('Payment failed:', response.error);
            });
            rzp1.open();

        } catch (error: any) {
            console.error('Payment initialization failed:', error);
            alert(error.response?.data?.error || 'Failed to initialize payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className={className || "bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    Processing...
                </div>
            ) : (
                children || 'Get Pass'
            )}
        </button>
    );
}
