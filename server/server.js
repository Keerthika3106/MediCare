const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const prescriptionRoutes = require('./routes/prescriptions');
const medicineIntakeRoutes = require('./routes/medicineIntakes');
const appointmentRoutes = require('./routes/appointments');
const complaintRoutes = require('./routes/complaints');

// Import jobs
const { startMedicineReminderJob } = require('./jobs/medicineReminders');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MediCare API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/medicine-intakes', medicineIntakeRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/complaints', complaintRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their role-specific room
  socket.on('joinRoom', (data) => {
    const { userId, role } = data;
    socket.join(`user_${userId}`);
    socket.join(`role_${role}`);
    console.log(`User ${userId} joined room for role ${role}`);
  });

  // Handle patient room joining
  socket.on('joinPatientRoom', (patientId) => {
    socket.join(`patient_${patientId}`);
    console.log(`User joined patient room: ${patientId}`);
  });

  // Handle doctor room joining
  socket.on('joinDoctorRoom', (doctorId) => {
    socket.join(`doctor_${doctorId}`);
    console.log(`User joined doctor room: ${doctorId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start medicine reminder job
startMedicineReminderJob(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
🏥 MediCare Server is running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
🔗 Health Check: http://localhost:${PORT}/api/health
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});