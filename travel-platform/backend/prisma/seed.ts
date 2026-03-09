import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.destination.createMany({
    data: [
      {
        name: 'Kyoto',
        country: 'Japan',
        description: 'Historic temples, gardens, and traditional tea houses.',
        imageUrl: 'https://picsum.photos/seed/kyoto/800/600',
        bestSeason: 'Spring',
        averageBudget: 1800,
      },
      {
        name: 'Barcelona',
        country: 'Spain',
        description: 'Vibrant architecture, beaches, and Catalan cuisine.',
        imageUrl: 'https://picsum.photos/seed/barcelona/800/600',
        bestSeason: 'Summer',
        averageBudget: 1500,
      },
      {
        name: 'Cape Town',
        country: 'South Africa',
        description: 'Mountain views, coastal drives, and wildlife adventures.',
        imageUrl: 'https://picsum.photos/seed/capetown/800/600',
        bestSeason: 'Autumn',
        averageBudget: 1400,
      },
      {
        name: 'Vancouver',
        country: 'Canada',
        description: 'Outdoor activities, modern city life, and scenic landscapes.',
        imageUrl: 'https://picsum.photos/seed/vancouver/800/600',
        bestSeason: 'Summer',
        averageBudget: 1700,
      },
      {
        name: 'Bali',
        country: 'Indonesia',
        description: 'Tropical beaches, rice terraces, and cultural retreats.',
        imageUrl: 'https://picsum.photos/seed/bali/800/600',
        bestSeason: 'Dry Season',
        averageBudget: 1200,
      },
    ],
    skipDuplicates: true,
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
