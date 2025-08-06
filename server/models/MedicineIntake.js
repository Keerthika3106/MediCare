const mongoose = require('mongoose');

const medicineIntakeSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  prescriptionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Prescription',
    required: [true, 'Prescription ID is required']
  },
  medicineId: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Medicine ID is required']
  },
  medicineName: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required'],
    trim: true
  },
  scheduledTime: {
    type: Date,
    required: [true, 'Scheduled time is required']
  },
  takenTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'taken', 'missed', 'skipped'],
    default: 'pending'
  },
  confirmedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  smsToken: {
    type: String,
    unique: true,
    sparse: true
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  alertsSent: [{
    type: {
      type: String,
      enum: ['reminder', 'missed', 'caretaker', 'family']
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
medicineIntakeSchema.index({ patientId: 1, scheduledTime: 1 });
medicineIntakeSchema.index({ status: 1, scheduledTime: 1 });

module.exports = mongoose.model('MedicineIntake', medicineIntakeSchema);