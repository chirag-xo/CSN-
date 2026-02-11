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

    // Get public chapters with filtering
    async getPublicChapters(filters: { cityId?: string; stateId?: string; state?: string }) {
        const { cityId, stateId, state } = filters;

        const where: any = {};

        const andConditions: any[] = [];

        if (cityId) {
            andConditions.push({
                OR: [
                    { cityId: cityId },
                    { city: { equals: cityId, mode: 'insensitive' } }
                ]
            });
        }

        if (stateId) {
            andConditions.push({ stateId: stateId });
        }

        if (state) {
            andConditions.push({
                OR: [
                    { stateId: state },
                    { state: { equals: state, mode: 'insensitive' } }
                ]
            });
        }

        if (andConditions.length > 0) {
            where.AND = andConditions;
        }

        return await prisma.chapter.findMany({
            where,
            select: {
                id: true,
                name: true,
                cityId: true,
                stateId: true,
                city: true,
            },
            orderBy: { name: 'asc' },
        });
    },
};
