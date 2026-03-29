import { Router } from 'express';
import { createBooking, getBookings, cancelBooking } from '../controllers/bookingController';

const router = Router();

// Public route to book
router.post('/', createBooking);

// Dashboard routes
router.get('/', getBookings);
router.patch('/:id/cancel', cancelBooking);

export default router;