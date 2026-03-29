import { PrismaClient } from '@prisma/client';
import { addMinutes, parse, format, isBefore, isWithinInterval } from 'date-fns';

const prisma = new PrismaClient();

export const getAvailableSlots = async (slug: string, dateStr: string) => {
  // dateStr format expected: 'YYYY-MM-DD'
  const targetDate = new Date(dateStr);
  const dayOfWeek = targetDate.getDay();

  // 1. Fetch Event Type and User Availability
  const eventType = await prisma.eventType.findUnique({
    where: { slug },
    include: { user: { include: { availabilities: { where: { dayOfWeek } } } } }
  });

  if (!eventType || eventType.user.availabilities.length === 0) {
    return []; // No availability for this day
  }

  const availability = eventType.user.availabilities[0];
  const duration = eventType.duration;

  // 2. Fetch existing bookings for this specific date to prevent double booking
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  const existingBookings = await prisma.booking.findMany({
    where: {
      eventTypeId: eventType.id,
      status: 'CONFIRMED',
      startTime: { gte: startOfDay, lte: endOfDay }
    }
  });

  // 3. Generate Time Slots
  const slots: string[] = [];
  let currentTime = parse(availability.startTime, 'HH:mm', targetDate);
  const endTime = parse(availability.endTime, 'HH:mm', targetDate);

  const now = new Date();

  while (isBefore(addMinutes(currentTime, duration), endTime) || currentTime.getTime() === endTime.getTime() - (duration * 60000)) {
    const slotEnd = addMinutes(currentTime, duration);
    
    // Only add slots in the future
    if (isBefore(now, currentTime)) {
      
      // 4. Check for overlaps with existing bookings
      const isOverlapping = existingBookings.some(booking => {
        // A slot overlaps if its start time is before the booking ends AND its end time is after the booking starts
        return (
          isBefore(currentTime, booking.endTime) && 
          isBefore(booking.startTime, slotEnd)
        );
      });

      if (!isOverlapping) {
        slots.push(format(currentTime, 'HH:mm'));
      }
    }
    
    // Increment by the duration of the meeting
    currentTime = addMinutes(currentTime, duration);
  }

  return slots;
};