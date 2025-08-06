const Prescription = require('../models/Prescription');
const MedicineIntake = require('../models/MedicineIntake');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create new prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor only)
const createPrescription = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { patientId, medicines, notes } = req.body;

    // Verify patient exists
    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Create prescription
    const prescription = await Prescription.create({
      patientId,
      doctorId: req.user.id,
      medicines,
      notes
    });

    // Create medicine intake schedules
    await createMedicineIntakeSchedules(prescription);

    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate('patientId', 'name age phone email')
      .populate('doctorId', 'name specialization phone email');

    // Emit real-time update
    req.io.emit('prescriptionCreated', {
      prescription: populatedPrescription,
      patientId
    });

    res.status(201).json({
      success: true,
      prescription: populatedPrescription
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating prescription'
    });
  }
};

// Helper function to create medicine intake schedules
const createMedicineIntakeSchedules = async (prescription) => {
  const intakes = [];
  
  for (const medicine of prescription.medicines) {
    const startDate = new Date(medicine.startDate);
    const endDate = new Date(medicine.endDate);
    
    // Generate daily schedules
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      if (medicine.times && medicine.times.length > 0) {
        for (const time of medicine.times) {
          const [hours, minutes] = time.split(':');
          const scheduledTime = new Date(date);
          scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          intakes.push({
            patientId: prescription.patientId,
            prescriptionId: prescription._id,
            medicineId: medicine._id,
            medicineName: medicine.name,
            dosage: medicine.dosage,
            scheduledTime,
            smsToken: generateSMSToken()
          });
        }
      }
    }
  }
  
  if (intakes.length > 0) {
    await MedicineIntake.insertMany(intakes);
  }
};

// Generate unique SMS token
const generateSMSToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// @desc    Get prescriptions
// @route   GET /api/prescriptions
// @access  Private
const getPrescriptions = async (req, res) => {
  try {
    let query = {};
    
    // Filter based on user role
    if (req.user.role === 'doctor') {
      query.doctorId = req.user.id;
    } else if (req.user.role === 'patient') {
      query.patientId = req.user.id;
    } else if (req.user.role === 'caretaker' && req.user.patientId) {
      query.patientId = req.user.patientId;
    } else if (req.user.role === 'family' && req.user.patientId) {
      query.patientId = req.user.patientId;
    }

    const prescriptions = await Prescription.find(query)
      .populate('patientId', 'name age phone email healthIssue')
      .populate('doctorId', 'name specialization phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      prescriptions
    });
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching prescriptions'
    });
  }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId', 'name age phone email healthIssue')
      .populate('doctorId', 'name specialization phone email');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Check authorization
    if (req.user.role === 'patient' && prescription.patientId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this prescription'
      });
    }

    if (req.user.role === 'doctor' && prescription.doctorId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this prescription'
      });
    }

    res.status(200).json({
      success: true,
      prescription
    });
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching prescription'
    });
  }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private (Doctor only)
const updatePrescription = async (req, res) => {
  try {
    let prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Check if user is the doctor who created the prescription
    if (prescription.doctorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this prescription'
      });
    }

    prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('patientId', 'name age phone email')
     .populate('doctorId', 'name specialization phone email');

    // Emit real-time update
    req.io.emit('prescriptionUpdated', {
      prescription,
      patientId: prescription.patientId._id
    });

    res.status(200).json({
      success: true,
      prescription
    });
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating prescription'
    });
  }
};

module.exports = {
  createPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescription
};