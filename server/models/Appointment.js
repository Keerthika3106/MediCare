const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Doctor ID is required']
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required'],
    trim: true
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    trim: true
  },
  urgency: {
    type: String,
    enum: ['routine', 'urgent', 'emergency'],
    default: 'routine'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  requestedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  confirmedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ doctorId: 1, date: 1 });
appointmentSchema.index({ patientId: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);