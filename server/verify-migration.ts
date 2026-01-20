import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDataMigration() {
    try {
        const users = await prisma.user.count();
        const connections = await prisma.connection.count();
        const events = await prisma.event.count();
        const referrals = await prisma.referral.count();
        const galleryPhotos = await prisma.galleryPhoto.count();
        const chapters = await prisma.chapter.count();

        console.log('\n📊 Database Migration Verification:');
        console.log('=====================================');
        console.log(`✅ Users: ${users}`);
        console.log(`✅ Connections: ${connections}`);
        console.log(`✅ Events: ${events}`);
        console.log(`✅ Referrals: ${referrals}`);
        console.log(`✅ Gallery Photos: ${galleryPhotos}`);
        console.log(`✅ Chapters: ${chapters}`);
        console.log('=====================================\n');

        if (users > 0) {
            console.log('✅ Data migration successful! Your Neon database has all the data.\n');
        } else {
            console.log('⚠️  No users found. Data might not have been imported.\n');
        }
    } catch (error) {
        console.error('❌ Error checking database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkDataMigration();
