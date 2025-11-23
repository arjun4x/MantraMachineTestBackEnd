import express from 'express'
import { createBooking, getAllBookings } from '../controllers/bookingController'
import { validateBooking } from '../middleware/validation'

const router = express.Router()

router.post('/bookings', validateBooking, createBooking)
router.get('/bookings', getAllBookings)

export default router



