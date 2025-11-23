"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBooking = void 0;
const express_validator_1 = require("express-validator");
exports.validateBooking = [
    // Sanitize and validate input
    (0, express_validator_1.body)('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters and spaces')
        .escape(),
    (0, express_validator_1.body)('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters and spaces')
        .escape(),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^[\d\s\-\+\(\)]+$/)
        .withMessage('Please provide a valid phone number')
        .isLength({ min: 10, max: 20 })
        .withMessage('Phone number must be between 10 and 20 characters'),
    (0, express_validator_1.body)('checkIn')
        .notEmpty()
        .withMessage('Check-in date is required')
        .isISO8601()
        .withMessage('Please provide a valid check-in date')
        .custom((value) => {
        const checkInDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (checkInDate < today) {
            throw new Error('Check-in date cannot be in the past');
        }
        return true;
    }),
    (0, express_validator_1.body)('checkOut')
        .notEmpty()
        .withMessage('Check-out date is required')
        .isISO8601()
        .withMessage('Please provide a valid check-out date')
        .custom((value, { req }) => {
        const checkOutDate = new Date(value);
        const checkInDate = new Date(req.body.checkIn);
        if (checkOutDate <= checkInDate) {
            throw new Error('Check-out date must be after check-in date');
        }
        return true;
    }),
    (0, express_validator_1.body)('guests')
        .notEmpty()
        .withMessage('Number of guests is required')
        .isInt({ min: 1, max: 10 })
        .withMessage('Number of guests must be between 1 and 10'),
    (0, express_validator_1.body)('roomType')
        .trim()
        .notEmpty()
        .withMessage('Room type is required')
        .isIn(['standard', 'deluxe', 'suite', 'villa'])
        .withMessage('Invalid room type selected'),
    (0, express_validator_1.body)('specialRequests')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Special requests must not exceed 500 characters')
        .escape(),
    // Check for validation errors
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array(),
            });
        }
        next();
    },
];
