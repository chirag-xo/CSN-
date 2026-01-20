import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedChapters() {
    const chapters = [
        { name: 'Haridwar', city: 'Haridwar' },
        { name: 'Roorkee', city: 'Roorkee' },
        { name: 'Dehradun', city: 'Dehradun' },
        { name: 'Delhi', city: 'Delhi' },
        { name: 'Mumbai', city: 'Mumbai' },
        { name: 'Bangalore', city: 'Bangalore' },
        { name: 'Hyderabad', city: 'Hyderabad' },
        { name: 'Chennai', city: 'Chennai' },
        { name: 'Pune', city: 'Pune' },
        { name: 'Kolkata', city: 'Kolkata' },
    ];

    console.log('🌱 Seeding chapters...\n');

    for (const chapter of chapters) {
        try {
            const existing = await prisma.chapter.findFirst({
                where: { name: chapter.name },
            });

            if (existing) {
                console.log(`⏭️  Skipped: ${chapter.name} (already exists)`);
            } else {
                await prisma.chapter.create({
                    data: chapter,
                });
                console.log(`✅ Created: ${chapter.name} - ${chapter.city}`);
            }
        } catch (error) {
            console.error(`❌ Error creating ${chapter.name}:`, error);
        }
    }

    console.log('\n✨ Chapter seeding completed!\n');

    // Show all chapters
    const allChapters = await prisma.chapter.findMany({
        orderBy: { name: 'asc' },
    });

    console.log('📋 All Chapters in Database:');
    allChapters.forEach(c => {
        console.log(`   - ${c.name} (${c.city})`);
    });

    await prisma.$disconnect();
}

seedChapters()
    .catch((error) => {
        console.error('Error seeding chapters:', error);
        process.exit(1);
    });
