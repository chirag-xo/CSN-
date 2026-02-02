import { PrismaClient } from '@prisma/client';
import { createClerkClient } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function migrateUsers() {
    console.log('🔄 Starting migration...');

    // 1. Fetch all users from local DB
    const users = await prisma.user.findMany();
    console.log(`📊 Found ${users.length} users in local database.`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const user of users) {
        try {
            // 2. Check if user already exists in Clerk
            const clerkUsers = await clerk.users.getUserList({
                emailAddress: [user.email],
            });

            if (clerkUsers.length > 0) {
                console.log(`⏭️  Skipping ${user.email} (Already exists in Clerk)`);
                skipCount++;
                continue;
            }

            // 3. Create user in Clerk
            // Note: We cannot migrate the password hash because Clerk uses a different hashing mechanism 
            // and doesn't support importing raw bcrypt hashes easily without specific enterprise plans or custom flows.
            // However, by creating them, we enable "Forgot Password" to work immediately.
            await clerk.users.createUser({
                emailAddress: [user.email],
                firstName: user.firstName || undefined,
                lastName: user.lastName || undefined,
                skipPasswordRequirement: true, // We don't have their raw password
                publicMetadata: {
                    migratedFromId: user.id
                }
            });

            console.log(`✅ Migrated ${user.email}`);
            successCount++;

        } catch (error: any) {
            console.error(`❌ Failed to migrate ${user.email}:`, error.errors?.[0]?.message || error.message);
            errorCount++;
        }
    }

    console.log('\n🏁 Migration Complete');
    console.log(`✅ Success: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`❌ Errors:  ${errorCount}`);
}

migrateUsers()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
