
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Create Default User (No login required assumption)
  const user = await prisma.user.upsert({
    where: { email: 'admin@calclone.com' },
    update: {},
    create: {
      email: 'admin@calclone.com',
      name: 'Admin User',
      timezone: 'Asia/Kolkata', // Set to your current timezone
    },
  });

  // 2. Create Sample Event Types
  const eventType1 = await prisma.eventType.upsert({
    where: { slug: '30-min-chat' },
    update: {},
    create: {
      title: '30 Min Quick Chat',
      description: 'A quick catch-up call.',
      duration: 30,
      slug: '30-min-chat',
      userId: user.id,
    },
  });

  // 3. Create Sample Availability (Monday - Friday, 9 AM - 5 PM)
  const days = [1, 2, 3, 4, 5]; 
  for (const day of days) {
    await prisma.availability.upsert({
      where: {
        userId_dayOfWeek: { userId: user.id, dayOfWeek: day },
      },
      update: {},
      create: {
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        userId: user.id,
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });