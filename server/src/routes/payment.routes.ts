import { Router, Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../shared/database';

const router = Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// Create Order
router.post('/create-order', async (req: Request, res: Response) => {
    try {
        const { eventId } = req.body;

        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Free event logic
        if (!event.entryFee || event.entryFee === 0) {
            return res.json({ isFree: true });
        }

        // Create Razorpay order
        const options = {
            amount: event.entryFee * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.json({
            isFree: false,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create payment order' });
    }
});

// Verify Payment
router.post('/verify', async (req: Request, res: Response) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            eventId
        } = req.body;

        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            console.log('Payment verified successfully for Event:', eventId, 'Payment ID:', razorpay_payment_id);
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            console.error('Payment verification failed for Event:', eventId);
            res.status(400).json({ success: false, error: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Error in payment verification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
