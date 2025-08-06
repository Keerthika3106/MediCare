const MedicineIntake = require('../models/MedicineIntake');
const User = require('../models/User');
const { sendSMS } = require('../utils/sms');

// @desc    Get medicine intakes
// @route   GET /api/medicine-intakes
// @access  Private
const getMedicineIntakes = async (req, res) => {
  try {
    let query = {};
    
    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patientId = req.user.id;
    } else if (req.user.role === 'caretaker' && req.user.patientId) {
      query.patientId = req.user.patientId;
    } else if (req.user.role === 'family' && req.user.patientId) {
      query.patientId = req.user.patientId;
    } else if (req.user.role === 'doctor') {
      // Get all patients assigned to this doctor
      const patients = await User.find({ assignedDoctor: req.user.id });
      const patientIds = patients.map(p => p._id);
      query.patientId = { $in: patientIds };
    }

    // Date filter
    const { date, status } = req.query;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.scheduledTime = { $gte: startDate, $lt: endDate };
    }

    if (status) {
      query.status = status;
    }

    const intakes = await MedicineIntake.find(query)
      .populate('patientId', 'name phone email')
      .populate('confirmedBy', 'name role')
      .sort({ scheduledTime: 1 });

    res.status(200).json({
      success: true,
      count: intakes.length,
      intakes
    });
  } catch (error) {
    console.error('Get medicine intakes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching medicine intakes'
    });
  }
};

// @desc    Update medicine intake status
// @route   PUT /api/medicine-intakes/:id
// @access  Private
const updateMedicineIntake = async (req, res) => {
  try {
    const { status, takenTime } = req.body;
    
    let intake = await MedicineIntake.findById(req.params.id);
    
    if (!intake) {
      return res.status(404).json({
        success: false,
        message: 'Medicine intake record not found'
      });
    }

    // Check authorization
    const canUpdate = (
      req.user.role === 'patient' && intake.patientId.toString() === req.user.id
    ) || (
      req.user.role === 'caretaker' && req.user.patientId && intake.patientId.toString() === req.user.patientId.toString()
    ) || (
      req.user.role === 'family' && req.user.patientId && intake.patientId.toString() === req.user.patientId.toString()
    );

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this intake record'
      });
    }

    intake.status = status;
    intake.confirmedBy = req.user.id;
    
    if (status === 'taken' && takenTime) {
      intake.takenTime = new Date(takenTime);
    } else if (status === 'taken') {
      intake.takenTime = new Date();
    }

    await intake.save();

    const populatedIntake = await MedicineIntake.findById(intake._id)
      .populate('patientId', 'name phone email')
      .populate('confirmedBy', 'name role');

    // Emit real-time update
    req.io.emit('medicineIntakeUpdated', {
      intake: populatedIntake,
      patientId: intake.patientId
    });

    // Send notifications if medicine was taken
    if (status === 'taken') {
      await sendIntakeNotifications(populatedIntake, 'taken');
    }

    res.status(200).json({
      success: true,
      intake: populatedIntake
    });
  } catch (error) {
    console.error('Update medicine intake error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating medicine intake'
    });
  }
};

// @desc    Confirm medicine intake via SMS token
// @route   GET /api/medicine-intakes/confirm/:token
// @access  Public
const confirmMedicineIntake = async (req, res) => {
  try {
    const { token } = req.params;
    
    const intake = await MedicineIntake.findOne({ smsToken: token })
      .populate('patientId', 'name phone email');
    
    if (!intake) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired confirmation token'
      });
    }

    // Check if already confirmed or too late
    if (intake.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Medicine intake already confirmed'
      });
    }

    // Update status
    intake.status = 'taken';
    intake.takenTime = new Date();
    intake.confirmedBy = intake.patientId;
    await intake.save();

    // Emit real-time update
    req.io.emit('medicineIntakeUpdated', {
      intake,
      patientId: intake.patientId._id
    });

    // Send confirmation notifications
    await sendIntakeNotifications(intake, 'taken');

    res.status(200).json({
      success: true,
      message: 'Medicine intake confirmed successfully',
      intake
    });
  } catch (error) {
    console.error('Confirm medicine intake error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error confirming medicine intake'
    });
  }
};

// Helper function to send intake notifications
const sendIntakeNotifications = async (intake, status) => {
  try {
    const patient = await User.findById(intake.patientId)
      .populate('caretakerId', 'name phone')
      .populate('familyMembers', 'name phone');

    const messages = [];

    if (status === 'taken') {
      // Notify caretaker
      if (patient.caretakerId && patient.caretakerId.phone) {
        messages.push({
          to: patient.caretakerId.phone,
          body: `✅ ${patient.name} has taken ${intake.medicineName} ${intake.dosage} at ${new Date().toLocaleTimeString()}.`
        });
      }

      // Notify family members
      if (patient.familyMembers && patient.familyMembers.length > 0) {
        patient.familyMembers.forEach(family => {
          if (family.phone) {
            messages.push({
              to: family.phone,
              body: `✅ ${patient.name} has taken ${intake.medicineName} ${intake.dosage} at ${new Date().toLocaleTimeString()}.`
            });
          }
        });
      }
    }

    // Send all messages
    for (const message of messages) {
      await sendSMS(message.to, message.body);
    }
  } catch (error) {
    console.error('Error sending intake notifications:', error);
  }
};

module.exports = {
  getMedicineIntakes,
  updateMedicineIntake,
  confirmMedicineIntake
};