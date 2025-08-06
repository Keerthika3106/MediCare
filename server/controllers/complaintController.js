const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { sendSMS } = require('../utils/sms');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Caretaker, Family)
const createComplaint = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { patientId, doctorId, title, description, urgency } = req.body;

    // Verify patient and doctor exist
    const patient = await User.findById(patientId);
    const doctor = await User.findById(doctorId);

    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check authorization - only caretaker or family can submit complaints
    const canSubmit = (
      req.user.role === 'caretaker' && req.user.patientId && req.user.patientId.toString() === patientId
    ) || (
      req.user.role === 'family' && req.user.patientId && req.user.patientId.toString() === patientId
    );

    if (!canSubmit) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit complaint for this patient'
      });
    }

    // Create complaint
    const complaint = await Complaint.create({
      patientId,
      doctorId,
      submittedBy: req.user.id,
      title,
      description,
      urgency
    });

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('patientId', 'name age phone email')
      .populate('doctorId', 'name specialization phone email')
      .populate('submittedBy', 'name role phone email');

    // Emit real-time update
    req.io.emit('complaintCreated', {
      complaint: populatedComplaint,
      doctorId,
      patientId
    });

    // Send SMS notification to doctor
    if (doctor.phone) {
      const urgencyEmoji = urgency === 'critical' ? '🚨' : urgency === 'high' ? '⚠️' : '📝';
      await sendSMS(
        doctor.phone,
        `${urgencyEmoji} New complaint from ${req.user.name} regarding patient ${patient.name}: ${title}. Urgency: ${urgency}.`
      );
    }

    res.status(201).json({
      success: true,
      complaint: populatedComplaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating complaint'
    });
  }
};

// @desc    Get complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    let query = {};
    
    // Filter based on user role
    if (req.user.role === 'doctor') {
      query.doctorId = req.user.id;
    } else if (req.user.role === 'caretaker' && req.user.patientId) {
      query.patientId = req.user.patientId;
      query.submittedBy = req.user.id;
    } else if (req.user.role === 'family' && req.user.patientId) {
      query.patientId = req.user.patientId;
      query.submittedBy = req.user.id;
    } else if (req.user.role === 'patient') {
      query.patientId = req.user.id;
    }

    // Status filter
    const { status, urgency } = req.query;
    if (status) {
      query.status = status;
    }
    if (urgency) {
      query.urgency = urgency;
    }

    const complaints = await Complaint.find(query)
      .populate('patientId', 'name age phone email healthIssue')
      .populate('doctorId', 'name specialization phone email')
      .populate('submittedBy', 'name role phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching complaints'
    });
  }
};

// @desc    Update complaint status/response
// @route   PUT /api/complaints/:id
// @access  Private (Doctor only)
const updateComplaint = async (req, res) => {
  try {
    const { status, response } = req.body;
    
    let complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check authorization - only the assigned doctor can update
    if (req.user.role !== 'doctor' || complaint.doctorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this complaint'
      });
    }

    // Update fields
    if (status) complaint.status = status;
    if (response) {
      complaint.response = response;
      complaint.respondedAt = new Date();
    }

    if (status === 'resolved') {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('patientId', 'name age phone email')
      .populate('doctorId', 'name specialization phone email')
      .populate('submittedBy', 'name role phone email');

    // Emit real-time update
    req.io.emit('complaintUpdated', {
      complaint: populatedComplaint,
      patientId: complaint.patientId,
      submitterId: complaint.submittedBy
    });

    // Send SMS notification to complaint submitter
    await sendComplaintNotifications(populatedComplaint, status, response);

    res.status(200).json({
      success: true,
      complaint: populatedComplaint
    });
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating complaint'
    });
  }
};

// Helper function to send complaint notifications
const sendComplaintNotifications = async (complaint, status, response) => {
  try {
    const submitter = await User.findById(complaint.submittedBy._id);
    
    if (submitter && submitter.phone) {
      let messageBody = '';
      
      switch (status) {
        case 'acknowledged':
          messageBody = `✅ Dr. ${complaint.doctorId.name} has acknowledged your complaint: "${complaint.title}".`;
          break;
        case 'in-progress':
          messageBody = `🔄 Dr. ${complaint.doctorId.name} is working on your complaint: "${complaint.title}".`;
          break;
        case 'resolved':
          messageBody = `✅ Your complaint "${complaint.title}" has been resolved by Dr. ${complaint.doctorId.name}.`;
          if (response) {
            messageBody += ` Response: ${response}`;
          }
          break;
      }

      if (messageBody) {
        await sendSMS(submitter.phone, messageBody);
      }
    }
  } catch (error) {
    console.error('Error sending complaint notifications:', error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  updateComplaint
};