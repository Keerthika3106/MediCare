const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { sendSMS } = require('../utils/sms');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { patientId, doctorId, date, time, reason, urgency, notes } = req.body;

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

    // Check for scheduling conflicts
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available at this time slot'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date: new Date(date),
      time,
      reason,
      urgency,
      notes,
      requestedBy: req.user.id
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name age phone email')
      .populate('doctorId', 'name specialization phone email')
      .populate('requestedBy', 'name role');

    // Emit real-time update
    req.io.emit('appointmentCreated', {
      appointment: populatedAppointment,
      doctorId,
      patientId
    });

    // Send SMS notification to doctor
    if (doctor.phone) {
      await sendSMS(
        doctor.phone,
        `📅 New appointment request from ${patient.name} for ${date} at ${time}. Reason: ${reason}. Urgency: ${urgency}.`
      );
    }

    res.status(201).json({
      success: true,
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating appointment'
    });
  }
};

// @desc    Get appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
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

    // Status filter
    const { status, date } = req.query;
    if (status) {
      query.status = status;
    }

    if (date) {
      query.date = new Date(date);
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name age phone email healthIssue')
      .populate('doctorId', 'name specialization phone email')
      .populate('requestedBy', 'name role')
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching appointments'
    });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const { status, notes, date, time } = req.body;
    
    let appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check authorization
    const canUpdate = (
      req.user.role === 'doctor' && appointment.doctorId.toString() === req.user.id
    ) || (
      req.user.role === 'patient' && appointment.patientId.toString() === req.user.id
    ) || (
      req.user.role === 'caretaker' && req.user.patientId && appointment.patientId.toString() === req.user.patientId.toString()
    );

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    // Update fields
    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    if (date) appointment.date = new Date(date);
    if (time) appointment.time = time;

    // Set timestamps
    if (status === 'confirmed') {
      appointment.confirmedAt = new Date();
    } else if (status === 'completed') {
      appointment.completedAt = new Date();
    }

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name age phone email')
      .populate('doctorId', 'name specialization phone email')
      .populate('requestedBy', 'name role');

    // Emit real-time update
    req.io.emit('appointmentUpdated', {
      appointment: populatedAppointment,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId
    });

    // Send SMS notifications
    await sendAppointmentNotifications(populatedAppointment, status);

    res.status(200).json({
      success: true,
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating appointment'
    });
  }
};

// Helper function to send appointment notifications
const sendAppointmentNotifications = async (appointment, status) => {
  try {
    const patient = await User.findById(appointment.patientId._id)
      .populate('caretakerId', 'name phone')
      .populate('familyMembers', 'name phone');

    const messages = [];
    let messageBody = '';

    switch (status) {
      case 'confirmed':
        messageBody = `✅ Your appointment with Dr. ${appointment.doctorId.name} on ${appointment.date.toDateString()} at ${appointment.time} has been confirmed.`;
        break;
      case 'cancelled':
        messageBody = `❌ Your appointment with Dr. ${appointment.doctorId.name} on ${appointment.date.toDateString()} at ${appointment.time} has been cancelled.`;
        break;
      case 'rescheduled':
        messageBody = `📅 Your appointment with Dr. ${appointment.doctorId.name} has been rescheduled to ${appointment.date.toDateString()} at ${appointment.time}.`;
        break;
      case 'completed':
        messageBody = `✅ Your appointment with Dr. ${appointment.doctorId.name} has been completed.`;
        break;
    }

    if (messageBody) {
      // Notify patient
      if (patient.phone) {
        messages.push({
          to: patient.phone,
          body: messageBody
        });
      }

      // Notify caretaker
      if (patient.caretakerId && patient.caretakerId.phone) {
        messages.push({
          to: patient.caretakerId.phone,
          body: `Patient Update: ${messageBody.replace('Your', `${patient.name}'s`)}`
        });
      }

      // Notify family members
      if (patient.familyMembers && patient.familyMembers.length > 0) {
        patient.familyMembers.forEach(family => {
          if (family.phone) {
            messages.push({
              to: family.phone,
              body: `Family Update: ${messageBody.replace('Your', `${patient.name}'s`)}`
            });
          }
        });
      }

      // Send all messages
      for (const message of messages) {
        await sendSMS(message.to, message.body);
      }
    }
  } catch (error) {
    console.error('Error sending appointment notifications:', error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment
};