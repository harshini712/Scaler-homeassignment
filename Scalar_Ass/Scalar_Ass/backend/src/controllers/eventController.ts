import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import catchAsync from '../utils/catchAsync';

const prisma = new PrismaClient();

// Helper to get default user
const getDefaultUser = async () => await prisma.user.findFirst();

export const getEventTypes = catchAsync(async (req: Request, res: Response) => {
  const user = await getDefaultUser();
  const events = await prisma.eventType.findMany({ where: { userId: user?.id } });
  res.status(200).json(events);
});

export const createEventType = catchAsync(async (req: Request, res: Response) => {
  const user = await getDefaultUser();
  const { title, description, duration, slug } = req.body; // Expects title, description, duration, and URL slug [cite: 16]

  const newEvent = await prisma.eventType.create({
    data: { title, description, duration, slug, userId: user!.id },
  });
  res.status(201).json(newEvent);
});

export const updateEventType = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;
  const updatedEvent = await prisma.eventType.update({
    where: { id },
    data: req.body,
  });
  res.status(200).json(updatedEvent);
});

export const deleteEventType = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;
  await prisma.eventType.delete({ where: { id } });
  res.status(204).send();
});