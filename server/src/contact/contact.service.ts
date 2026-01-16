import { z } from 'zod';
import prisma from '../shared/database';

export const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    reason: z.string().min(10, 'Reason must be at least 10 characters'),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const contactService = {
    async submitContactForm(data: ContactInput) {
        // 1. Validate Input (Double check)
        const validatedData = contactSchema.parse(data);

        // 2. Save to Database
        const request = await prisma.contactRequest.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                reason: validatedData.reason,
            },
        });

        // 3. Mock Email Sending
        console.log('\n📧 ===================================================');
        console.log('TO: admin@csn.com');
        console.log('SUBJECT: New Contact Request from ' + validatedData.name);
        console.log('---------------------------------------------------');
        console.log(`Name: ${validatedData.name}`);
        console.log(`Email: ${validatedData.email}`);
        console.log(`Reason:\n${validatedData.reason}`);
        console.log('===================================================\n');

        return request;
    },
};
