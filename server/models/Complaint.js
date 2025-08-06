const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
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
  submittedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Submitter ID is required']
  },
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Complaint description is required'],
    trim: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  response: {
    type: String,
    trim: true
  },
  respondedAt: {
    type: Date
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
complaintSchema.index({ doctorId: 1, status: 1 });
complaintSchema.index({ patientId: 1, createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);