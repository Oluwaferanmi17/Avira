const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkReviews() {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                stay: true,
                event: true,
                experience: true,
                user: true,
                reply: true,
            }
        });
        console.log('Total reviews:', reviews.length);
        if (reviews.length > 0) {
            console.log('Sample review:', JSON.stringify(reviews[0], null, 2));
        }

        const stays = await prisma.stay.findMany({ select: { id: true, hostId: true } });
        console.log('Stays count:', stays.length);

        const users = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
        console.log('Users count:', users.length);

    } catch (error) {
        console.error('Diagnosis failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkReviews();
