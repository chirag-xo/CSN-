import express from 'express';
import { contactService, contactSchema } from './contact.service';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        // Validation handled here or in service, doing it here provides immediate feedback
        const validation = contactSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validation.error.errors,
            });
        }

        const request = await contactService.submitContactForm(validation.data);

        res.status(201).json({
            success: true,
            message: 'Contact request submitted successfully',
            data: request,
        });
    } catch (error: any) {
        console.error('Contact submission error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit contact request',
        });
    }
});

export default router;
