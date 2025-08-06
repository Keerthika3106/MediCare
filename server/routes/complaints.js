const express = require('express');
const { body } = require('express-validator');
const {
  createComplaint,
  getComplaints,
  updateComplaint
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const complaintValidation = [
  body('patientId')
    .isMongoId()
    .withMessage('Please provide a valid patient ID'),
  body('doctorId')
    .isMongoId()
    .withMessage('Please provide a valid doctor ID'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('urgency')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Please provide a valid urgency level')
];

// Routes
router.route('/')
  .get(protect, getComplaints)
  .post(protect, authorize('caretaker', 'family'), complaintValidation, createComplaint);

router.route('/:id')
  .put(protect, authorize('doctor'), updateComplaint);

module.exports = router;