import { Router } from 'express';
import { getEventTypes, createEventType, updateEventType, deleteEventType } from '../controllers/eventController';

const router = Router();

router.route('/')
  .get(getEventTypes)
  .post(createEventType);

router.route('/:id')
  .put(updateEventType)
  .delete(deleteEventType);

export default router;