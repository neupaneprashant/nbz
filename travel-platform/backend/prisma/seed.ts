import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.destination.deleteMany();

  await prisma.destination.createMany({
    data: [
      {
        name: 'Paris',
        country: 'France',
        description:
          'Paris is known for its iconic landmarks, world-class museums, and romantic riverfront atmosphere. From the Eiffel Tower to cozy cafés, the city blends art, fashion, and history in every neighborhood.',
        imageUrl: 'https://source.unsplash.com/800x600/?paris,france',
        bestSeason: 'Spring (March - May)',
        averageBudget: 210,
        featured: true,
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        description:
          'Tokyo offers a dynamic mix of cutting-edge technology and timeless tradition. Travelers can explore neon-lit districts, serene temples, incredible food scenes, and efficient public transport.',
        imageUrl: 'https://source.unsplash.com/800x600/?tokyo,japan',
        bestSeason: 'Autumn (September - November)',
        averageBudget: 190,
        featured: true,
      },
      {
        name: 'Bali',
        country: 'Indonesia',
        description:
          'Bali is a tropical island destination famous for beaches, rice terraces, and spiritual retreats. It is ideal for travelers seeking relaxation, cultural experiences, and nature adventures.',
        imageUrl: 'https://source.unsplash.com/800x600/?bali,indonesia',
        bestSeason: 'Dry Season (April - October)',
        averageBudget: 95,
        featured: true,
      },
      {
        name: 'New York',
        country: 'USA',
        description:
          'New York City is a global hub of culture, business, and entertainment with iconic skylines and diverse neighborhoods. Visitors can enjoy Broadway shows, museums, and vibrant city life day and night.',
        imageUrl: 'https://source.unsplash.com/800x600/?newyork,usa',
        bestSeason: 'Fall (September - November)',
        averageBudget: 260,
        featured: true,
      },
      {
        name: 'Rome',
        country: 'Italy',
        description:
          'Rome is an open-air museum filled with ancient ruins, Renaissance art, and charming piazzas. It combines rich history with incredible cuisine and lively street culture.',
        imageUrl: 'https://source.unsplash.com/800x600/?rome,italy',
        bestSeason: 'Spring (April - June)',
        averageBudget: 170,
        featured: false,
      },
      {
        name: 'Barcelona',
        country: 'Spain',
        description:
          'Barcelona is a coastal city known for Gaudí architecture, Mediterranean beaches, and energetic nightlife. Its food markets, walkable districts, and creative spirit make it a favorite for many travelers.',
        imageUrl: 'https://source.unsplash.com/800x600/?barcelona,spain',
        bestSeason: 'Late Spring (May - June)',
        averageBudget: 160,
        featured: false,
      },
      {
        name: 'Dubai',
        country: 'UAE',
        description:
          'Dubai features futuristic architecture, luxury shopping, and desert adventures all in one destination. The city is known for modern attractions, premium hospitality, and year-round events.',
        imageUrl: 'https://source.unsplash.com/800x600/?dubai,uae',
        bestSeason: 'Winter (November - March)',
        averageBudget: 220,
        featured: false,
      },
      {
        name: 'Sydney',
        country: 'Australia',
        description:
          'Sydney combines iconic harbor views, famous beaches, and a laid-back lifestyle. Travelers can enjoy outdoor activities, cultural venues, and vibrant neighborhoods across the city.',
        imageUrl: 'https://source.unsplash.com/800x600/?sydney,australia',
        bestSeason: 'Spring (September - November)',
        averageBudget: 200,
        featured: false,
      },
      {
        name: 'Cape Town',
        country: 'South Africa',
        description:
          'Cape Town is surrounded by dramatic mountains and ocean landscapes, offering a perfect mix of nature and city life. It is popular for scenic drives, beaches, and nearby wine regions.',
        imageUrl: 'https://source.unsplash.com/800x600/?capetown,southafrica',
        bestSeason: 'Summer (November - March)',
        averageBudget: 130,
        featured: false,
      },
      {
        name: 'Santorini',
        country: 'Greece',
        description:
          'Santorini is renowned for whitewashed villages, blue-domed churches, and sunset views over the Aegean Sea. It offers beautiful coastlines, local wines, and romantic island experiences.',
        imageUrl: 'https://source.unsplash.com/800x600/?santorini,greece',
        bestSeason: 'Summer (June - September)',
        averageBudget: 185,
        featured: false,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
