const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedReviews() {
    try {
        console.log('--- Mock Review Seeder ---');

        // 1. Find a host (User who owns stays)
        const host = await prisma.user.findFirst({
            where: {
                OR: [
                    { stays: { some: {} } },
                    { experiences: { some: {} } },
                    { events: { some: {} } }
                ]
            },
            include: {
                stays: true,
                experiences: true,
                events: true
            }
        });

        if (!host) {
            console.log('No host found with any listings (Stay/Experience/Event). Please create a listing first.');
            return;
        }

        console.log(`Found host: ${host.name || host.email} (ID: ${host.id})`);

        // 2. Create or find a mock guest user
        let guest = await prisma.user.findUnique({
            where: { email: 'mockguest@avira.com' }
        });

        if (!guest) {
            guest = await prisma.user.create({
                data: {
                    name: 'Mock Guest',
                    email: 'mockguest@avira.com',
                    image: 'https://i.pravatar.cc/150?u=mockguest'
                }
            });
            console.log('Created mock guest user.');
        }

        // 3. Create reviews for stays
        if (host.stays.length > 0) {
            for (const stay of host.stays) {
                await prisma.review.upsert({
                    where: {
                        userId_stayId: {
                            userId: guest.id,
                            stayId: stay.id
                        }
                    },
                    update: {},
                    create: {
                        rating: 5,
                        comment: `This stay at ${stay.title} was absolutely amazing! Highly recommended.`,
                        userId: guest.id,
                        stayId: stay.id
                    }
                });
                console.log(`Added/Updated review for stay: ${stay.title}`);
            }
        }

        // 4. Create reviews for experiences
        if (host.experiences.length > 0) {
            for (const exp of host.experiences) {
                await prisma.review.upsert({
                    where: {
                        userId_experienceId: {
                            userId: guest.id,
                            experienceId: exp.id
                        }
                    },
                    update: {},
                    create: {
                        rating: 4,
                        comment: `Really enjoyed the ${exp.title} experience. Very unique!`,
                        userId: guest.id,
                        experienceId: exp.id
                    }
                });
                console.log(`Added/Updated review for experience: ${exp.title}`);
            }
        }

        // 5. Create reviews for events
        if (host.events.length > 0) {
            for (const event of host.events) {
                await prisma.review.upsert({
                    where: {
                        userId_eventId: {
                            userId: guest.id,
                            eventId: event.id
                        }
                    },
                    update: {},
                    create: {
                        rating: 5,
                        comment: `The ${event.title} event was well organized and fun!`,
                        userId: guest.id,
                        eventId: event.id
                    }
                });
                console.log(`Added/Updated review for event: ${event.title}`);
            }
        }

        console.log('--- Seeding Complete ---');
        console.log('You can now check the Host Dashboard -> Reviews tab.');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedReviews();
