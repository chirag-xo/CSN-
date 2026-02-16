import prisma from '../shared/database';

export const chapterService = {
    // Get all chapters
    async getAllChapters() {
        const chapters = await prisma.chapter.findMany({
            select: {
                id: true,
                name: true,
                City: {
                    select: { name: true }
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        // Map to preserve legacy structure if needed, or just return as is
        // Assuming frontend expects 'city' field
        return chapters.map(c => ({
            ...c,
            city: c.City?.name || null,
            City: undefined
        }));
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
                    { City: { name: { equals: cityId, mode: 'insensitive' } } }
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
                    { State: { name: { equals: state, mode: 'insensitive' } } }
                ]
            });
        }

        if (andConditions.length > 0) {
            where.AND = andConditions;
        }

        const chapters = await prisma.chapter.findMany({
            where,
            select: {
                id: true,
                name: true,
                cityId: true,
                stateId: true,
                City: {
                    select: { name: true }
                },
                State: {
                    select: { name: true }
                }
            },
            orderBy: { name: 'asc' },
        });

        return chapters.map(c => ({
            ...c,
            city: c.City?.name || null,
            state: c.State?.name || null,
            City: undefined,
            State: undefined
        }));
    },
};
