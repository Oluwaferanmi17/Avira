import { PrismaClient, WeekDay } from "@prisma/client";

const prisma = new PrismaClient();

// --- Nigerian Data Sets ---

// 1. Locations (Cities & Lat/Longs)
const nigerianLocations = [
  {
    city: "Lagos",
    country: "Nigeria",
    area: "Lekki Phase 1",
    lat: 6.4281,
    lng: 3.4219,
  },
  {
    city: "Abuja",
    country: "Nigeria",
    area: "Maitama",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    city: "Port Harcourt",
    country: "Nigeria",
    area: "GRA Phase 2",
    lat: 4.8156,
    lng: 7.0498,
  },
  {
    city: "Lagos",
    country: "Nigeria",
    area: "Victoria Island",
    lat: 6.4281,
    lng: 3.4219,
  },
  {
    city: "Abuja",
    country: "Nigeria",
    area: "Wuse 2",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    city: "Calabar",
    country: "Nigeria",
    area: "Duke Town",
    lat: 4.9757,
    lng: 8.3417,
  },
  {
    city: "Ibadan",
    country: "Nigeria",
    area: "Bodija",
    lat: 7.3775,
    lng: 3.947,
  },
  {
    city: "Enugu",
    country: "Nigeria",
    area: "Independence Layout",
    lat: 6.4584,
    lng: 7.5464,
  },
  {
    city: "Lagos",
    country: "Nigeria",
    area: "Ikeja GRA",
    lat: 6.5818,
    lng: 3.3211,
  },
  {
    city: "Uyo",
    country: "Nigeria",
    area: "Ewet Housing",
    lat: 5.0377,
    lng: 7.9128,
  },
];

// 2. Stay Descriptions
const stayTitles = [
  "Modern Apartment with Sea View",
  "Luxury Villa with Private Pool",
  "Cozy Studio near the Airport",
  "Exclusive Penthouse Suite",
  "Traditional Guest House",
];

const stayDescriptions = [
  "Enjoy 24/7 electricity and fast wifi in this secure estate.",
  "Perfect for detty december relaxation.",
  "Close to the best suya spots and nightlife.",
  "Serene environment with easy access to the central business district.",
  "A home away from home with complimentary breakfast.",
];

// 3. Cultural Experiences
const nigerianExperiences = [
  { title: "Lagos Market Tour", cat: "Culture", price: 15000 },
  { title: "Afrobeats Dance Class", cat: "Dance", price: 10000 },
  { title: "Authentic Jollof Cooking", cat: "Food", price: 25000 },
  { title: "Pottery in Minna", cat: "Art", price: 20000 },
  { title: "Lekki Conservation Walk", cat: "Nature", price: 5000 },
  { title: "Suya & Grills Night", cat: "Food", price: 12000 },
  { title: "Adire Tie-Dye Workshop", cat: "Art", price: 18000 },
  { title: "Kayak at Jabi Lake", cat: "Sports", price: 8000 },
  { title: "Nike Art Gallery Tour", cat: "Art", price: 5000 },
  { title: "Palm Wine Tasting", cat: "Food", price: 7500 },
];

// 4. Events
const nigerianEvents = [
  { title: "Lagos Fashion Week", cat: "Fashion", venue: "Eko Hotel" },
  { title: "Davido Live Concert", cat: "Music", venue: "Eko Atlantic" },
  { title: "Abuja Tech Summit", cat: "Business", venue: "ICC Abuja" },
  { title: "Calabar Carnival", cat: "Festival", venue: "Stadium" },
  { title: "Food Festival", cat: "Food", venue: "Muri Okunola Park" },
  { title: "Felabration", cat: "Music", venue: "New Afrika Shrine" },
  { title: "Mainland Block Party", cat: "Party", venue: "Secret Garden" },
  { title: "Art X Lagos", cat: "Art", venue: "Federal Palace" },
  { title: "Nollywood Premiere", cat: "Film", venue: "Filmhouse IMAX" },
  { title: "Comedy Night Live", cat: "Comedy", venue: "Muson Centre" },
];

async function main() {
  console.log("🌱 Starting Nigerian Database Seed...");

  // 1. CLEANUP
  await prisma.review.deleteMany();
  await prisma.tripItem.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.pricing.deleteMany();
  await prisma.address.deleteMany();
  await prisma.capacity.deleteMany();
  await prisma.stay.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Database cleaned");

  // --- 2. CREATE STAYS (10 Items) ---
  console.log("... Seeding 10 Nigerian Stays");

  for (let i = 0; i < 10; i++) {
    const loc = nigerianLocations[i % nigerianLocations.length];

    // Create Unique Host
    const host = await prisma.user.create({
      data: {
        name: `Host ${loc.city} ${i + 1}`,
        email: `host${i}@naija.com`,
        image: `https://i.pravatar.cc/150?u=host${i}`,
        hashedPassword: "password123",
      },
    });

    await prisma.stay.create({
      data: {
        title: `${stayTitles[i % 5]} in ${loc.area}`,
        description: stayDescriptions[i % 5],
        homeType: i % 2 === 0 ? "Apartment" : "Duplex",
        photos: [
          `https://source.unsplash.com/random/800x600?house,interior,${i}`,
          `https://source.unsplash.com/random/800x600?bedroom,${i}`,
        ],
        amenities: ["24/7 Power", "Wifi", "AC", "Security", "Parking"],
        rules: ["No smoking inside", "Quiet hours after 10 PM"],
        isPublished: true,
        hostId: host.id,
        // Relations
        capacity: {
          create: {
            guests: 2 + (i % 4),
            bedrooms: 1 + (i % 3),
            beds: 1 + (i % 3),
            baths: 1 + (i % 3),
          },
        },
        address: {
          create: {
            country: loc.country,
            city: loc.city,
            line1: `Plot ${i * 12} ${loc.area}`,
            lat: loc.lat,
            lng: loc.lng,
          },
        },
        pricing: {
          create: {
            // Price in Naira (e.g., 45,000 to 150,000 per night)
            basePrice: 45000 + i * 10000,
            cleaningFee: 5000,
            serviceFee: 2500,
          },
        },
        availability: {
          create: {
            unavailable: [new Date("2025-12-25"), new Date(`2025-12-31`)],
          },
        },
      },
    });
  }

  // --- 3. CREATE EXPERIENCES (10 Items) ---
  console.log("... Seeding 10 Nigerian Experiences");

  for (let i = 0; i < 10; i++) {
    const expData = nigerianExperiences[i];

    const host = await prisma.user.create({
      data: {
        name: `Guide ${i + 1}`,
        email: `guide${i}@naija.com`,
        image: `https://i.pravatar.cc/150?u=guide${i}`,
        hashedPassword: "password123",
      },
    });

    await prisma.experience.create({
      data: {
        title: expData.title,
        description: "Join us for an unforgettable cultural immersion.",
        category: expData.cat,
        duration: "3 hours",
        price: expData.price, // Prices set in array above
        rating: 4.5 + Math.random() * 0.5,
        photos: [
          `https://source.unsplash.com/random/800x600?africa,${expData.cat}`,
        ],
        country: "Nigeria",
        city: i % 2 === 0 ? "Lagos" : "Abuja",
        venue: "Local Center",
        highlights: ["Transport included", "Light refreshments"],
        availableDays: [WeekDay.FRIDAY, WeekDay.SATURDAY, WeekDay.SUNDAY],
        hostId: host.id,
      },
    });
  }

  // --- 4. CREATE EVENTS (10 Items) ---
  console.log("... Seeding 10 Nigerian Events");

  for (let i = 0; i < 10; i++) {
    const eventData = nigerianEvents[i];

    const host = await prisma.user.create({
      data: {
        name: `Promoter ${i + 1}`,
        email: `promoter${i}@naija.com`,
        image: `https://i.pravatar.cc/150?u=promoter${i}`,
        hashedPassword: "password123",
      },
    });

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + i * 7); // Weekly events

    await prisma.event.create({
      data: {
        title: eventData.title,
        description: "The biggest event of the season. Do not miss out!",
        category: eventData.cat,
        dateStart: startDate,
        dateEnd: new Date(startDate.getTime() + 1000 * 60 * 60 * 5), // 5 hours later
        ticketPrice: 5000 + i * 2000, // 5k - 25k tickets
        capacity: 500 + i * 100,
        attendees: i * 50,
        photos: [
          `https://source.unsplash.com/random/800x600?concert,party,${i}`,
        ],
        country: "Nigeria",
        city: "Lagos", // Most big events in Lagos for this seed
        venue: eventData.venue,
        userId: host.id,
      },
    });
  }

  // --- 5. CREATE REVIEWS (5 Reviews) ---
  console.log("... Seeding Reviews");

  const stays = await prisma.stay.findMany({ take: 5 });

  for (let i = 0; i < stays.length; i++) {
    const reviewer = await prisma.user.create({
      data: {
        name: `Tunde Reviewer ${i + 1}`,
        email: `tunde${i}@test.com`,
        image: `https://i.pravatar.cc/150?u=tunde${i}`,
      },
    });

    await prisma.review.create({
      data: {
        rating: 4,
        comment: "Omo, the place was too clean. The AC was chilling!",
        userId: reviewer.id,
        stayId: stays[i].id,
      },
    });
  }

  console.log("✅ Nigerian Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
