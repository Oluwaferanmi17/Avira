// /* eslint-disable @typescript-eslint/no-var-requires */
// import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { PrismaClient, WeekDay } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌍 Seeding database with mock data...");

  // 1️⃣ Create Users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        // password: faker.internet.password(),
        profileImage: faker.image.avatar(),
      },
    });
    users.push(user);
  }

  // 2️⃣ Create Stays
  const homeTypes = ["Apartment", "Villa", "Bungalow", "Cottage", "Loft"];
  const amenities = [
    "WiFi",
    "Air conditioning",
    "TV",
    "Kitchen",
    "Parking",
    "Pool",
  ];
  const rules = ["No smoking", "No pets", "No parties"];
  const cities = [
    "Lagos",
    "Abuja",
    "Kaduna",
    "Ibadan",
    "Enugu",
    "Port Harcourt",
  ];
  const countries = ["Nigeria"];

  for (let i = 0; i < 40; i++) {
    const host = faker.helpers.arrayElement(users);
    await prisma.stay.create({
      data: {
        title: faker.company.catchPhrase(),
        description: faker.lorem.paragraph(),
        homeType: faker.helpers.arrayElement(homeTypes),
        photos: Array.from({ length: 4 }, () =>
          faker.image.urlLoremFlickr({ category: "house" })
        ),
        amenities,
        rules,
        additionalRules: "Respect the neighbors and keep noise down.",
        hostId: host.id,
        isPublished: faker.datatype.boolean(),
      },
    });
  }

  // 3️⃣ Create Events (local + modern)
  const eventSamples = [
    "Oju-Oba Festival",
    "Yam Festival",
    "Google Developer Event",
    "Davido Live in Lagos",
    "Trance Nation Abuja",
    "Detty December",
    "Capital Block Party",
    "Cyberspace Expo",
  ];

  for (let i = 0; i < 30; i++) {
    const title = faker.helpers.arrayElement(eventSamples);
    const startDate = faker.date.between({
      from: "2025-01-01",
      to: "2025-12-31",
    });
    const endDate = faker.date.soon({
      days: faker.number.int({ min: 1, max: 3 }),
      refDate: startDate,
    });
    const city = faker.helpers.arrayElement(cities);

    await prisma.event.create({
      data: {
        title,
        description: faker.lorem.sentences(2),
        category: faker.helpers.arrayElement([
          "Festival",
          "Tech",
          "Music",
          "Culture",
        ]),
        dateStart: startDate,
        dateEnd: endDate,
        attendees: faker.number.int({ min: 50, max: 5000 }),
        ticketPrice: faker.number.int({ min: 1000, max: 20000 }),
        capacity: faker.number.int({ min: 100, max: 10000 }),
        photos: Array.from({ length: 3 }, () =>
          faker.image.urlLoremFlickr({ category: "event" })
        ),
        country: "Nigeria",
        city,
        venue: `${faker.company.name()} Arena`,
        userId: faker.helpers.arrayElement(users).id,
      },
    });
  }

  // 4️⃣ Create Experiences (local + modern)
  const experienceSamples = [
    "Badagry Slave Museum Tour",
    "Lekki Conservation Center Visit",
    "Abuja Amusement Park",
    "Fishing at Tarkwa Bay",
    "Hiking at Idanre Hills",
    "Kayaking in Lagos Lagoon",
    "Food Tasting in Ibadan",
    "Cultural Dance at Osogbo Grove",
  ];

  const weekdays = Object.values(WeekDay);

  for (let i = 0; i < 30; i++) {
    const host = faker.helpers.arrayElement(users);
    const title = faker.helpers.arrayElement(experienceSamples);
    const city = faker.helpers.arrayElement(cities);

    await prisma.experience.create({
      data: {
        title,
        description: faker.lorem.paragraphs(1),
        category: faker.helpers.arrayElement([
          "Adventure",
          "Culture",
          "Nature",
          "Relaxation",
        ]),
        duration: `${faker.number.int({ min: 1, max: 6 })} hours`,
        price: faker.number.int({ min: 5000, max: 50000 }),
        rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
        photos: Array.from({ length: 3 }, () =>
          faker.image.urlLoremFlickr({ category: "travel" })
        ),
        country: "Nigeria",
        city,
        venue: `${title} Venue`,
        highlights: [
          faker.lorem.words(3),
          faker.lorem.words(4),
          faker.lorem.words(3),
        ],
        availableDays: faker.helpers.arrayElements(
          weekdays,
          faker.number.int({ min: 2, max: 5 })
        ),
        hostId: host.id,
      },
    });
  }

  console.log("✅ Mock data generated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
