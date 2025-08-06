const express = require('express');
const {
  getMedicineIntakes,
  updateMedicineIntake,
  confirmMedicineIntake
} = require('../controllers/medicineIntakeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/', protect, getMedicineIntakes);
router.put('/:id', protect, updateMedicineIntake);
router.get('/confirm/:token', confirmMedicineIntake); // Public route for SMS confirmation

module.exports = router;