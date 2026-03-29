import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import { getAvailableSlots } from '../services/slotService';

const prisma = new PrismaClient();
const getDefaultUser = async () => await prisma.user.findFirst();

export const getAvailability = catchAsync(async (req: Request, res: Response) => {
  const user = await getDefaultUser();
  const availability = await prisma.availability.findMany({ where: { userId: user?.id } });
  res.status(200).json(availability);
});

export const updateAvailability = catchAsync(async (req: Request, res: Response) => {
  const user = await getDefaultUser();
  const { availabilities } = req.body; // Array of { dayOfWeek, startTime, endTime }

  // Transaction to delete old and insert new availability cleanly
  await prisma.$transaction(async (tx) => {
    await tx.availability.deleteMany({ where: { userId: user!.id } });
    
    const newAvailabilities = availabilities.map((a: any) => ({
      ...a,
      userId: user!.id,
    }));
    
    await tx.availability.createMany({ data: newAvailabilities });
  });

  res.status(200).json({ message: 'Availability updated successfully' });
});

// PUBLIC: Get available time slots for the booking page
export const getPublicSlots = catchAsync(async (req: Request, res: Response) => {
  const { slug, date } = req.query; // e.g., ?slug=30-min-chat&date=2024-05-20
  
  if (!slug || !date) {
    return res.status(400).json({ message: 'Slug and date are required' });
  }

  const slots = await getAvailableSlots(slug as string, date as string);
  res.status(200).json({ slots });
});