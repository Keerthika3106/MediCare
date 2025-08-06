const express = require('express');
const { body } = require('express-validator');
const {
  createAppointment,
  getAppointments,
  updateAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const appointmentValidation = [
  body('patientId')
    .isMongoId()
    .withMessage('Please provide a valid patient ID'),
  body('doctorId')
    .isMongoId()
    .withMessage('Please provide a valid doctor ID'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Reason for appointment is required'),
  body('urgency')
    .optional()
    .isIn(['routine', 'urgent', 'emergency'])
    .withMessage('Please provide a valid urgency level')
];

// Routes
router.route('/')
  .get(protect, getAppointments)
  .post(protect, appointmentValidation, createAppointment);

router.route('/:id')
  .put(protect, updateAppointment);

module.exports = router;