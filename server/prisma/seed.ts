import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting CSN database seed...');

    // ============================================================================
    // 1. CREATE CHAPTER
    // ============================================================================
    const chapter = await prisma.chapter.upsert({
        where: { name: 'San Francisco Tech' },
        update: {},
        create: {
            name: 'San Francisco Tech',
            city: 'San Francisco',
        },
    });
    console.log('✅ Created chapter:', chapter.name);

    // ============================================================================
    // 2. SEED INTEREST CATEGORIES & INTERESTS
    // ============================================================================
    const interestData = [
        {
            type: 'PROFESSIONAL',
            interests: ['Technology', 'Marketing', 'Finance', 'Startups', 'Consulting']
        },
        {
            type: 'LIFESTYLE',
            interests: ['Fitness', 'Travel', 'Music', 'Food', 'Photography']
        },
        {
            type: 'LEARNING',
            interests: ['Reading', 'Podcasts', 'Workshops', 'Mentoring']
        },
        {
            type: 'SOCIAL',
            interests: ['Gaming', 'Sports', 'Arts', 'Volunteering']
        }
    ];

    for (const categoryData of interestData) {
        const category = await prisma.interestCategory.upsert({
            where: { name: categoryData.type },
            update: {},
            create: {
                name: categoryData.type,
                type: categoryData.type,
            },
        });

        for (const interestName of categoryData.interests) {
            await prisma.interest.upsert({
                where: { name: interestName },
                update: {},
                create: {
                    name: interestName,
                    categoryId: category.id,
                },
            });
        }
    }
    console.log('✅ Seeded 4 interest categories with 18 interests');

    // ============================================================================
    // 3. CREATE TEST USERS
    // ============================================================================
    const hashedPassword = await bcrypt.hash('123test', 10);

    const testUser = await prisma.user.upsert({
        where: { email: 'test@gmail.com' },
        update: {},
        create: {
            email: 'test@gmail.com',
            password: hashedPassword,
            firstName: 'John',
            lastName: 'Doe',
            company: 'Tech Solutions Inc',
            position: 'Senior Developer',
            city: 'San Francisco',
            phone: '+1-555-0123',
            bio: 'Passionate about technology and networking',
            tagline: 'Building the future, one connection at a time',
            chapterId: chapter.id,
            emailVerified: true,
            emailVerifiedAt: new Date(),
            communityVerified: true,
        },
    });
    console.log('✅ Created test user:', testUser.email);

    // Create privacy settings for test user
    await prisma.userPrivacy.upsert({
        where: { userId: testUser.id },
        update: {},
        create: {
            userId: testUser.id,
            emailVisibility: 'PUBLIC',
            phoneVisibility: 'PRIVATE',
            eventsVisibility: 'CONNECTIONS',
            interestsVisibility: 'PUBLIC',
            activityVisibility: 'CONNECTIONS',
        },
    });
    console.log('✅ Created privacy settings for test user');

    const secondUser = await prisma.user.upsert({
        where: { email: 'jane@example.com' },
        update: {},
        create: {
            email: 'jane@example.com',
            password: await bcrypt.hash('password123', 10),
            firstName: 'Jane',
            lastName: 'Smith',
            company: 'Marketing Pro',
            position: 'Marketing Director',
            city: 'San Francisco',
            phone: '+1-555-0456',
            bio: 'Marketing expert with 10+ years of experience',
            tagline: 'Connecting brands with their audience',
            chapterId: chapter.id,
            emailVerified: true,
            emailVerifiedAt: new Date(),
            communityVerified: false,
        },
    });
    console.log('✅ Created second user:', secondUser.email);

    // Create privacy settings for second user
    await prisma.userPrivacy.upsert({
        where: { userId: secondUser.id },
        update: {},
        create: {
            userId: secondUser.id,
        },
    });

    // ============================================================================
    // 3A. CREATE ADDITIONAL 10 USERS FOR CONNECTIONS
    // ============================================================================
    const additionalUsers = await Promise.all([
        { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@example.com', company: 'Tech Innovations', position: 'Product Manager' },
        { firstName: 'Mike', lastName: 'Chen', email: 'mike.chen@example.com', company: 'StartupHub', position: 'CTO' },
        { firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.rodriguez@example.com', company: 'Design Studio', position: 'UX Lead' },
        { firstName: 'David', lastName: 'Kim', email: 'david.kim@example.com', company: 'AI Labs', position: 'ML Engineer' },
        { firstName: 'Lisa', lastName: 'Patel', email: 'lisa.patel@example.com', company: 'FinTech Solutions', position: 'CFO' },
        { firstName: 'James', lastName: 'Brown', email: 'james.brown@example.com', company: 'Marketing Pro', position: 'CMO' },
        { firstName: 'Anna', lastName: 'Martinez', email: 'anna.martinez@example.com', company: 'Legal Advisors', position: 'Attorney' },
        { firstName: 'Robert', lastName: 'Taylor', email: 'robert.taylor@example.com', company: 'Sales Corp', position: 'Sales Director' },
        { firstName: 'Michelle', lastName: 'Lee', email: 'michelle.lee@example.com', company: 'HR Solutions', position: 'HR Manager' },
        { firstName: 'Chris', lastName: 'Anderson', email: 'chris.anderson@example.com', company: 'Consulting Group', position: 'Senior Consultant' },
    ].map(async (userData) => {
        return prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                password: await bcrypt.hash('password123', 10),
                company: userData.company,
                position: userData.position,
                city: 'San Francisco',
                bio: `Professional ${userData.position} at ${userData.company}`,
                tagline: 'Connecting and growing together',
                chapterId: chapter.id,
                emailVerified: true,
                emailVerifiedAt: new Date(),
            },
        });
    }));
    console.log(`✅ Created ${additionalUsers.length} additional users for connections`);

    // ============================================================================
    // 4. ADD INTERESTS TO USERS
    // ============================================================================
    const techInterest = await prisma.interest.findUnique({ where: { name: 'Technology' } });
    const fitnessInterest = await prisma.interest.findUnique({ where: { name: 'Fitness' } });
    const startupsInterest = await prisma.interest.findUnique({ where: { name: 'Startups' } });

    if (techInterest && fitnessInterest && startupsInterest) {
        await prisma.userInterest.upsert({
            where: { userId_interestId: { userId: testUser.id, interestId: techInterest.id } },
            update: {},
            create: {
                userId: testUser.id,
                interestId: techInterest.id,
                visibility: 'PUBLIC',
            },
        });

        await prisma.userInterest.upsert({
            where: { userId_interestId: { userId: testUser.id, interestId: fitnessInterest.id } },
            update: {},
            create: {
                userId: testUser.id,
                interestId: fitnessInterest.id,
                visibility: 'PUBLIC',
            },
        });

        await prisma.userInterest.upsert({
            where: { userId_interestId: { userId: testUser.id, interestId: startupsInterest.id } },
            update: {},
            create: {
                userId: testUser.id,
                interestId: startupsInterest.id,
                visibility: 'PUBLIC',
            },
        });
        console.log('✅ Added 3 interests to test user');
    }

    // ============================================================================
    // 5. CREATE SAMPLE REFERRALS
    // ============================================================================
    const referral1 = await prisma.referral.create({
        data: {
            fromUserId: testUser.id,
            toUserId: secondUser.id,
            description: 'Great marketing opportunity for new tech product',
            contactName: 'Alice Johnson',
            contactEmail: 'alice@startup.com',
            businessValue: 5000,
            status: 'PENDING',
        },
    });

    const referral2 = await prisma.referral.create({
        data: {
            fromUserId: secondUser.id,
            toUserId: testUser.id,
            description: 'Software development project',
            contactName: 'Bob Williams',
            contactEmail: 'bob@company.com',
            businessValue: 10000,
            status: 'CONVERTED',
        },
    });
    console.log('✅ Created 2 sample referrals');

    // ============================================================================
    // 6. CREATE SAMPLE EVENT
    // ============================================================================
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);

    const event = await prisma.event.create({
        data: {
            title: 'Tech Networking Mixer',
            description: 'Join us for an evening of networking with tech professionals',
            type: 'NETWORKING',
            location: 'Downtown Tech Hub',
            isVirtual: false,
            date: tomorrow,
            isRecurring: true,
            recurrenceType: 'WEEKLY',
            chapterId: chapter.id,
            creatorId: testUser.id,
        },
    });
    console.log('✅ Created sample event');

    // Add attendees
    await prisma.eventAttendee.create({
        data: {
            eventId: event.id,
            userId: testUser.id,
            status: 'GOING',
            role: 'HOST',
        },
    });

    await prisma.eventAttendee.create({
        data: {
            eventId: event.id,
            userId: secondUser.id,
            status: 'GOING',
            role: 'ATTENDEE',
        },
    });
    console.log('✅ Added 2 attendees to event');

    // ============================================================================
    // 7. CREATE SAMPLE TESTIMONIAL
    // ============================================================================
    await prisma.testimonial.create({
        data: {
            fromUserId: secondUser.id,
            toUserId: testUser.id,
            type: 'REFERRAL',
            content: 'John provided an excellent referral that resulted in a ₹10,000 project. Highly professional and trustworthy!',
            referralId: referral2.id,
            visibility: 'PUBLIC',
        },
    });
    console.log('✅ Created sample testimonial');

    // ============================================================================
    // 8. CREATE VERIFICATION
    // ============================================================================
    await prisma.userVerification.upsert({
        where: {
            userId_verifiedBy: {
                userId: testUser.id,
                verifiedBy: secondUser.id,
            },
        },
        update: {},
        create: {
            userId: testUser.id,
            verifiedBy: secondUser.id,
        },
    });
    console.log('✅ Created verification vouching');

    // ============================================================================
    // 9. CREATE CONNECTION BETWEEN USERS
    // ============================================================================
    await prisma.connection.upsert({
        where: {
            requesterId_addresseeId: {
                requesterId: testUser.id,
                addresseeId: secondUser.id,
            },
        },
        update: {},
        create: {
            requesterId: testUser.id,
            addresseeId: secondUser.id,
            status: 'ACCEPTED',
        },
    });
    console.log('✅ Created connection between test users');

    // Create connections with all additional users
    for (const user of additionalUsers) {
        await prisma.connection.upsert({
            where: {
                requesterId_addresseeId: {
                    requesterId: testUser.id,
                    addresseeId: user.id,
                },
            },
            update: {},
            create: {
                requesterId: testUser.id,
                addresseeId: user.id,
                status: 'ACCEPTED',
            },
        });
    }
    console.log(`✅ Created ${additionalUsers.length} connections for test user`);

    // ============================================================================
    // 10. CREATE PRIVATE EVENT (John invites Jane)
    // ============================================================================
    const privateEvent = await prisma.event.create({
        data: {
            title: 'Private Networking Dinner',
            description: 'Exclusive networking dinner for selected members. Join us for an intimate evening of meaningful connections and conversations.',
            type: 'NETWORKING',
            location: 'The Ivy Restaurant, San Francisco',
            isVirtual: false,
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // +3 hours
            isRecurring: false,
            chapterId: chapter.id,
            creatorId: testUser.id,
            isPublic: false, // Private event
        },
    });

    // Add John as organizer (GOING)
    await prisma.eventAttendee.create({
        data: {
            eventId: privateEvent.id,
            userId: testUser.id,
            status: 'GOING',
            role: 'ORGANIZER',
        },
    });

    // Add Jane as invited attendee
    await prisma.eventAttendee.create({
        data: {
            eventId: privateEvent.id,
            userId: secondUser.id,
            status: 'INVITED',
            role: 'ATTENDEE',
        },
    });

    console.log('✅ Created private event with invitation');

    console.log('🎉 CSN database seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
