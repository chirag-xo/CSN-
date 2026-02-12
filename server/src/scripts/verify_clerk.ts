
import 'dotenv/config';
import { clerkClient } from '@clerk/clerk-sdk-node';

async function verifyClerk() {
    console.log('Checking Clerk Configuration...');
    const key = process.env.CLERK_SECRET_KEY;
    console.log(`CLERK_SECRET_KEY is present: ${!!key}`);

    if (!key) {
        console.error('Missing CLERK_SECRET_KEY');
        process.exit(1);
    }

    try {
        console.log('Attempting to fetch client list (or any simple read operation)...');
        // We can't list users easily without pagination, but we can try to get the client list or just catch a generic error
        const users = await clerkClient.users.getUserList({ limit: 1 });
        console.log(`Successfully connected to Clerk. Found ${users.length} users.`);
        console.log('Clerk integration seems functional.');
    } catch (error: any) {
        console.error('Failed to connect to Clerk:', error.message || error);
        if (error.status === 401) {
            console.error('Authentication invalid. Check your CLERK_SECRET_KEY.');
        }
    }
}

verifyClerk();
