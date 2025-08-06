const express = require('express');
const { body } = require('express-validator');
const {
  createPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescription
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const prescriptionValidation = [
  body('patientId')
    .isMongoId()
    .withMessage('Please provide a valid patient ID'),
  body('medicines')
    .isArray({ min: 1 })
    .withMessage('At least one medicine is required'),
  body('medicines.*.name')
    .trim()
    .notEmpty()
    .withMessage('Medicine name is required'),
  body('medicines.*.dosage')
    .trim()
    .notEmpty()
    .withMessage('Medicine dosage is required'),
  body('medicines.*.frequency')
    .trim()
    .notEmpty()
    .withMessage('Medicine frequency is required'),
  body('medicines.*.startDate')
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('medicines.*.endDate')
    .isISO8601()
    .withMessage('Valid end date is required')
];

// Routes
router.route('/')
  .get(protect, getPrescriptions)
  .post(protect, authorize('doctor'), prescriptionValidation, createPrescription);

router.route('/:id')
  .get(protect, getPrescription)
  .put(protect, authorize('doctor'), updatePrescription);

module.exports = router;