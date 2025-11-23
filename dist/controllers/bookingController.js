"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBookings = exports.createBooking = void 0;
const database_1 = require("../config/database");
const createBooking = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, checkIn, checkOut, guests, roomType, specialRequests, } = req.body;
        const query = `
      INSERT INTO bookings (
        first_name, last_name, email, phone, 
        check_in, check_out, guests, room_type, special_requests
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
        const values = [
            firstName,
            lastName,
            email,
            phone,
            checkIn,
            checkOut,
            guests,
            roomType,
            specialRequests || null,
        ];
        const result = await database_1.pool.query(query, values);
        const booking = result.rows[0];
        // Format response to match frontend expectations
        const formattedBooking = {
            id: booking.id,
            firstName: booking.first_name,
            lastName: booking.last_name,
            email: booking.email,
            phone: booking.phone,
            checkIn: booking.check_in,
            checkOut: booking.check_out,
            guests: booking.guests,
            roomType: booking.room_type,
            specialRequests: booking.special_requests,
            createdAt: booking.created_at,
        };
        res.status(201).json(formattedBooking);
    }
    catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            message: 'Failed to create booking',
            error: error.message
        });
    }
};
exports.createBooking = createBooking;
const getAllBookings = async (req, res) => {
    try {
        const query = `
      SELECT * FROM bookings 
      ORDER BY created_at DESC
    `;
        const result = await database_1.pool.query(query);
        // Format response to match frontend expectations
        const formattedBookings = result.rows.map((booking) => ({
            id: booking.id,
            firstName: booking.first_name,
            lastName: booking.last_name,
            email: booking.email,
            phone: booking.phone,
            checkIn: booking.check_in,
            checkOut: booking.check_out,
            guests: booking.guests,
            roomType: booking.room_type,
            specialRequests: booking.special_requests,
            createdAt: booking.created_at,
        }));
        res.json(formattedBookings);
    }
    catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            message: 'Failed to fetch bookings',
            error: error.message
        });
    }
};
exports.getAllBookings = getAllBookings;
