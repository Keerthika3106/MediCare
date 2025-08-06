# MediCare Healthcare Management System

A comprehensive full-stack healthcare management application built with React.js, Node.js, Express.js, and MongoDB. MediCare facilitates seamless coordination between doctors, patients, pharmacists, caretakers, and family members with real-time medicine tracking, SMS notifications, and appointment management.

## 🏥 Features

### Multi-Role Dashboard System
- **Doctor Dashboard**: Patient management, prescription creation, appointment scheduling, visit reports
- **Patient Dashboard**: Medicine tracking, appointment requests, health records, SMS confirmations
- **Pharmacist Dashboard**: Prescription management, medicine dispensing, inventory tracking
- **Caretaker Dashboard**: Patient monitoring, medicine intake tracking, doctor reporting
- **Family Dashboard**: Patient status monitoring, alert notifications, appointment requests

### Core Functionality
- **Real-time Medicine Tracking**: SMS reminders and automatic alerts for missed doses
- **Appointment Management**: Scheduling, confirmation, and status updates
- **Prescription System**: Complete medicine management with dosage and timing
- **SMS Integration**: Twilio-powered notifications for all stakeholders
- **Real-time Updates**: Socket.IO for instant dashboard updates
- **Secure Authentication**: JWT-based login system with role-based access

## 🚀 Tech Stack

### Frontend
- **React.js** with TypeScript
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Axios** for API calls
- **Socket.IO Client** for real-time updates

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.IO** for real-time communication
- **Twilio** for SMS notifications
- **bcryptjs** for password hashing
- **express-validator** for input validation

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Twilio account (for SMS features)

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd medicare-app

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/medicare

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Twilio SMS (Optional - will simulate SMS if not provided)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### 3. Database Setup

Make sure MongoDB is running on your system:

```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas cloud database
# Update MONGODB_URI in .env with your Atlas connection string
```

### 4. Start the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
# or for development with auto-reload:
npm run dev
```

**Terminal 2 - Frontend Application:**
```bash
# From root directory
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔐 Demo Accounts

The application includes demo accounts for testing all roles:

| Role | Email | Password |
|------|-------|----------|
| Doctor | doctor@medicare.com | password |
| Patient | patient@medicare.com | password |
| Pharmacist | pharmacist@medicare.com | password |
| Caretaker | caretaker@medicare.com | password |
| Family Member | family@medicare.com | password |

## 📱 SMS Integration

### Twilio Setup (Optional)
1. Create a Twilio account at https://www.twilio.com
2. Get your Account SID, Auth Token, and Phone Number
3. Add these to your `.env` file
4. SMS notifications will be sent for:
   - Medicine reminders (15 minutes before scheduled time)
   - Missed medicine alerts (to caretakers and family)
   - Appointment confirmations and updates
   - Doctor notifications for complaints

**Note**: If Twilio credentials are not provided, the system will simulate SMS sending and log messages to the console.

## 🔄 Real-time Features

The application uses Socket.IO for real-time updates:
- **Medicine intake updates** appear instantly across all relevant dashboards
- **Appointment status changes** are reflected immediately
- **New prescriptions** trigger real-time notifications
- **Complaint submissions** alert doctors instantly

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: express-validator for API input sanitization
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Secure cross-origin resource sharing
- **Helmet.js**: Security headers for Express.js

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Prescriptions
- `GET /api/prescriptions` - Get prescriptions (role-filtered)
- `POST /api/prescriptions` - Create prescription (doctors only)
- `GET /api/prescriptions/:id` - Get single prescription
- `PUT /api/prescriptions/:id` - Update prescription (doctors only)

### Medicine Intakes
- `GET /api/medicine-intakes` - Get medicine intakes (role-filtered)
- `PUT /api/medicine-intakes/:id` - Update intake status
- `GET /api/medicine-intakes/confirm/:token` - Confirm via SMS token

### Appointments
- `GET /api/appointments` - Get appointments (role-filtered)
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment status

### Complaints
- `GET /api/complaints` - Get complaints (role-filtered)
- `POST /api/complaints` - Create complaint (caretakers/family only)
- `PUT /api/complaints/:id` - Update complaint (doctors only)

## 🎨 UI/UX Features

- **Professional Healthcare Theme**: Blue and white color scheme
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Role-based Color Coding**: Each user type has distinct visual identity
- **Intuitive Navigation**: Clean card-based layout with clear hierarchy
- **Real-time Feedback**: Instant visual updates for all actions
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 🔧 Development

### Project Structure
```
medicare-app/
├── src/                          # Frontend React application
│   ├── components/              # React components
│   │   ├── dashboards/         # Role-specific dashboards
│   │   ├── Login.tsx           # Authentication components
│   │   └── Register.tsx
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── DataContext.tsx     # Application data state
│   └── App.tsx                 # Main application component
├── server/                      # Backend Node.js application
│   ├── controllers/            # Route controllers
│   ├── models/                 # MongoDB models
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── utils/                  # Utility functions
│   ├── jobs/                   # Background jobs (SMS reminders)
│   └── server.js               # Main server file
└── README.md
```

### Adding New Features
1. **Backend**: Add models, controllers, and routes
2. **Frontend**: Create components and update contexts
3. **Real-time**: Add Socket.IO events for live updates
4. **SMS**: Integrate Twilio notifications where needed

## 🚀 Deployment

### Backend Deployment (Railway/Render)
1. Push code to GitHub repository
2. Connect to Railway or Render
3. Set environment variables
4. Deploy automatically

### Frontend Deployment (Vercel/Netlify)
1. Update API base URL for production
2. Build the application: `npm run build`
3. Deploy to Vercel or Netlify

### Environment Variables for Production
Update these for production deployment:
- `MONGODB_URI`: Production MongoDB connection string
- `CLIENT_URL`: Production frontend URL
- `NODE_ENV`: Set to "production"
- Add all Twilio credentials for SMS functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the API health endpoint: `/api/health`
- Review console logs for debugging
- Ensure all environment variables are set correctly
- Verify MongoDB connection
- Test Twilio credentials (optional)

---

**MediCare** - Transforming healthcare through technology 🏥💙