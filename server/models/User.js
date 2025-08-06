const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['doctor', 'patient', 'pharmacist', 'caretaker', 'family'],
    required: [true, 'Please specify a role']
  },
  phone: {
    type: String,
    trim: true
  },
  specialization: {
    type: String,
    trim: true
  },
  assignedDoctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  assignedPatients: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  caretakerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  familyMembers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  healthIssue: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: 0,
    max: 150
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);