import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import { addMinutes, parseISO } from 'date-fns';
import { getAvailableSlots } from '../services/slotService';

const prisma = new PrismaClient();

// Public: Create a booking
export const createBooking = catchAsync(async (req: Request, res: Response) => {
  const { slug, bookerName, bookerEmail, date, startTime } = req.body; // date: 'YYYY-MM-DD', startTime: 'HH:mm'

  // 1. Verify Event Type exists
  const eventType = await prisma.eventType.findUnique({ where: { slug } });
  if (!eventType) return res.status(404).json({ message: 'Event type not found' });

  // 2. Prevent Double Booking: Verify the slot is still actually available 
  const availableSlots = await getAvailableSlots(slug, date);
  if (!availableSlots.includes(startTime)) {
    return res.status(409).json({ message: 'This time slot is no longer available.' });
  }

  // 3. Calculate exact start and end Date objects
  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = addMinutes(startDateTime, eventType.duration);

  // 4. Create Booking
  const booking = await prisma.booking.create({
    data: {
      bookerName,
      bookerEmail, // Collect booker's name and email [cite: 27]
      startTime: startDateTime,
      endTime: endDateTime,
      eventTypeId: eventType.id,
    },
  });

  // TODO: Trigger Email Notification (Bonus feature) here

  res.status(201).json(booking);
});

// Admin Dashboard: Get Bookings (Upcoming & Past) 
export const getBookings = catchAsync(async (req: Request, res: Response) => {
  const now = new Date();
  
  const upcoming = await prisma.booking.findMany({
    where: { startTime: { gte: now }, status: 'CONFIRMED' },
    include: { eventType: true },
    orderBy: { startTime: 'asc' }
  });

  const past = await prisma.booking.findMany({
    where: { startTime: { lt: now } },
    include: { eventType: true },
    orderBy: { startTime: 'desc' }
  });

  res.status(200).json({ upcoming, past });
});

// Admin Dashboard: Cancel Booking 
export const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;
  
  const booking = await prisma.booking.update({
    where: { id },
    data: { status: 'CANCELLED' }
  });

  res.status(200).json(booking);
});