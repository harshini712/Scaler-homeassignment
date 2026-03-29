import { Router } from 'express';
import { getAvailability, updateAvailability, getPublicSlots } from '../controllers/availabilityController';

const router = Router();

router.route('/')
  .get(getAvailability)
  .put(updateAvailability); // Overwrites weekly schedule

// Public route for the booking page
router.get('/slots', getPublicSlots);

export default router;