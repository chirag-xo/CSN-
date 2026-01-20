import prisma from '../shared/database';

export const chapterService = {
    // Get all chapters
    async getAllChapters() {
        return await prisma.chapter.findMany({
            select: {
                id: true,
                name: true,
                city: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    },
};
