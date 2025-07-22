import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LogOut, Calendar, Pill, User, Clock, AlertCircle, CheckCircle, Phone, Plus, Bell, Heart, Activity, FileText } from 'lucide-react';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const { prescriptions, appointments, patients } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showMedicineDetails, setShowMedicineDetails] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Filter data for current patient
  const patientPrescriptions = prescriptions.filter(p => p.patientId === user?.id);
  const patientAppointments = appointments.filter(a => a.patientId === user?.id);
  const assignedDoctor = patients.find(p => p.id === user?.id)?.doctorId;

  const handleRequestAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // In a real app, this would save to database
    console.log('Appointment requested:', {
      doctorId: assignedDoctor,
      date: formData.get('date'),
      time: formData.get('time'),
      reason: formData.get('reason'),
      urgency: formData.get('urgency')
    });
    
    setShowAppointmentForm(false);
  };

  const handleMarkMedicineTaken = (medicineId: string) => {
    // In a real app, this would update the database and send SMS confirmations
    console.log('Medicine marked as taken:', medicineId);
  };

  const todaysMedicines = [
    { id: 'MED001', name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', beforeFood: true, status: 'taken' },
    { id: 'MED002', name: 'Aspirin', dosage: '81mg', time: '2:00 PM', beforeFood: false, status: 'missed' },
    { id: 'MED003', name: 'Vitamin D', dosage: '1000 IU', time: '8:00 PM', beforeFood: false, status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.name}</p>
              <p className="text-sm text-green-600">Patient ID: {user?.id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">{user?.phone}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Pill className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{patientPrescriptions.length}</p>
                <p className="text-gray-600">Active Prescriptions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{patientAppointments.length}</p>
                <p className="text-gray-600">Appointments</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{todaysMedicines.length}</p>
                <p className="text-gray-600">Today's Medicines</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">85%</p>
                <p className="text-gray-600">Adherence Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'medicines', label: 'Medicines', icon: Pill },
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'health', label: 'Health Records', icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Patient Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      My Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Patient ID:</span>
                        <span className="font-medium bg-white px-2 py-1 rounded">{user?.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{user?.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{user?.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium flex items-center">
                          {user?.phone}
                          <Phone className="h-4 w-4 ml-2 text-green-600" />
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Assigned Doctor:</span>
                        <span className="font-medium text-blue-600">Dr. Sarah Johnson</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Health Issue:</span>
                        <span className="font-medium text-red-600">Hypertension</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                          Update Profile
                        </button>
                        <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors">
                          Contact Doctor
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Today's Schedule */}
                  <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                        Today's Medicine Schedule
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {todaysMedicines.map((medicine) => (
                        <div key={medicine.id} className={`flex items-center justify-between p-3 border rounded-lg ${
                          medicine.status === 'taken' ? 'bg-green-50 border-green-200' :
                          medicine.status === 'missed' ? 'bg-red-50 border-red-200' :
                          'bg-yellow-50 border-yellow-200'
                        }`}>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{medicine.name} {medicine.dosage}</p>
                            <p className="text-sm text-gray-600">
                              {medicine.time} - {medicine.beforeFood ? 'Before food' : 'After food'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {medicine.status === 'taken' && <CheckCircle className="h-5 w-5 text-green-600" />}
                            {medicine.status === 'missed' && <AlertCircle className="h-5 w-5 text-red-600" />}
                            {medicine.status === 'pending' && (
                              <button
                                onClick={() => handleMarkMedicineTaken(medicine.id)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                              >
                                Mark Taken
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setShowAppointmentForm(true)}
                      className="flex flex-col items-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Request Appointment</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('medicines')}
                      className="flex flex-col items-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      <Pill className="h-8 w-8 text-green-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">View Medicines</span>
                    </button>
                    
                    <button 
                      onClick={() => window.open('tel:+1-555-0101', '_self')}
                      className="flex flex-col items-center p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                    >
                      <Phone className="h-8 w-8 text-purple-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Contact Doctor</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('health')}
                      className="flex flex-col items-center p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                    >
                      <FileText className="h-8 w-8 text-orange-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Health Records</span>
                    </button>
                  </div>
                </div>

                {/* Health Summary */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-600" />
                    Health Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-gray-600">Medicine Adherence</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">Good</div>
                      <div className="text-sm text-gray-600">Overall Health</div>
                      <div className="text-xs text-gray-500 mt-1">Last updated: Today</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">2</div>
                      <div className="text-sm text-gray-600">Upcoming Appointments</div>
                      <div className="text-xs text-gray-500 mt-1">Next: Tomorrow</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medicines Tab */}
            {activeTab === 'medicines' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">My Prescriptions</h3>
                    <p className="text-sm text-gray-600">Track your medications and intake schedule</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm text-gray-600">SMS reminders enabled</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {patientPrescriptions.map((prescription) => (
                    <div key={prescription.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Prescription #{prescription.id}</h4>
                          <p className="text-gray-600">Prescribed on {prescription.date}</p>
                          <p className="text-sm text-blue-600">Dr. Sarah Johnson</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          prescription.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {prescription.status}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {prescription.medicines.map((medicine) => (
                          <div key={medicine.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{medicine.name}</p>
                                <p className="text-sm text-gray-600">
                                  {medicine.dosage} - {medicine.frequency}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {medicine.beforeFood ? 'Take before food' : 'Take after food'}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedMedicine(medicine);
                                    setShowMedicineDetails(true);
                                  }}
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleMarkMedicineTaken(medicine.id)}
                                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                                >
                                  Mark Taken
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-3">
                              <div>
                                <p className="font-medium">Duration</p>
                                <p>{medicine.startDate} to {medicine.endDate}</p>
                              </div>
                              <div>
                                <p className="font-medium">Instructions</p>
                                <p>{medicine.instructions || 'No special instructions'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {prescription.notes && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">Doctor's Notes:</p>
                          <p className="text-blue-700 mt-1">{prescription.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {patientPrescriptions.length === 0 && (
                  <div className="text-center py-12">
                    <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No active prescriptions.</p>
                    <p className="text-sm text-gray-400 mt-2">Contact your doctor if you need medication.</p>
                  </div>
                )}
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">My Appointments</h3>
                    <p className="text-sm text-gray-600">Manage your healthcare appointments</p>
                  </div>
                  <button
                    onClick={() => setShowAppointmentForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Request Appointment</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {patientAppointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-semibold text-gray-900">Dr. Sarah Johnson</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              appointment.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{appointment.reason}</p>
                          <p className="text-sm text-gray-500">Appointment ID: {appointment.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">{appointment.date}</p>
                          <p className="text-blue-600 font-medium">{appointment.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span>+1-555-0101</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Cardiology</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          {appointment.status === 'confirmed' && (
                            <>
                              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Reschedule
                              </button>
                              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                                Cancel
                              </button>
                            </>
                          )}
                          {appointment.status === 'pending' && (
                            <span className="text-sm text-yellow-600">Waiting for confirmation</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {patientAppointments.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments scheduled.</p>
                    <button
                      onClick={() => setShowAppointmentForm(true)}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Request Your First Appointment
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Health Records Tab */}
            {activeTab === 'health' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Health Records</h3>
                    <p className="text-sm text-gray-600">Your medical history and health data</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Health Metrics */}
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Health Metrics</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Blood Pressure</p>
                          <p className="text-sm text-gray-600">Last checked: 2 days ago</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-red-600">140/90</p>
                          <p className="text-xs text-red-600">High</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Heart Rate</p>
                          <p className="text-sm text-gray-600">Last checked: Today</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">72 BPM</p>
                          <p className="text-xs text-green-600">Normal</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Weight</p>
                          <p className="text-sm text-gray-600">Last checked: 1 week ago</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">75 kg</p>
                          <p className="text-xs text-blue-600">Stable</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Reports */}
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Recent Reports</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Blood Test Results</p>
                          <p className="text-sm text-gray-600">Jan 15, 2024</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Report
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">ECG Report</p>
                          <p className="text-sm text-gray-600">Jan 10, 2024</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Report
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">X-Ray Chest</p>
                          <p className="text-sm text-gray-600">Dec 28, 2023</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Timeline */}
                <div className="bg-white border rounded-lg p-6 mt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Health Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Medicine taken on time</p>
                        <p className="text-sm text-gray-600">Lisinopril 10mg - 8:00 AM</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Appointment scheduled</p>
                        <p className="text-sm text-gray-600">Follow-up with Dr. Johnson</p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-100 p-2 rounded-full">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Medicine missed</p>
                        <p className="text-sm text-gray-600">Aspirin 81mg - 2:00 PM</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Request Form Modal */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Request Appointment</h2>
            </div>
            
            <form onSubmit={handleRequestAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time *
                </label>
                <select
                  name="time"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit *
                </label>
                <select
                  name="reason"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select reason</option>
                  <option value="Regular check-up">Regular check-up</option>
                  <option value="Follow-up visit">Follow-up visit</option>
                  <option value="Medication review">Medication review</option>
                  <option value="Health concern">Health concern</option>
                  <option value="Emergency consultation">Emergency consultation</option>
                  <option value="Test results review">Test results review</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency Level *
                </label>
                <select
                  name="urgency"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select urgency</option>
                  <option value="routine">Routine - Within 2 weeks</option>
                  <option value="urgent">Urgent - Within 3 days</option>
                  <option value="emergency">Emergency - Same day</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional information about your symptoms or concerns"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAppointmentForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Request Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Medicine Details Modal */}
      {showMedicineDetails && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Medicine Details</h2>
                <button
                  onClick={() => setShowMedicineDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedMedicine.name}</h3>
                  <p className="text-gray-600">{selectedMedicine.dosage}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Frequency</p>
                    <p className="text-gray-900">{selectedMedicine.frequency}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Food Instructions</p>
                    <p className="text-gray-900">
                      {selectedMedicine.beforeFood ? 'Before food' : 'After food'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Start Date</p>
                    <p className="text-gray-900">{selectedMedicine.startDate}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">End Date</p>
                    <p className="text-gray-900">{selectedMedicine.endDate}</p>
                  </div>
                </div>
                
                {selectedMedicine.instructions && (
                  <div>
                    <p className="font-medium text-gray-700">Special Instructions</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedMedicine.instructions}
                    </p>
                  </div>
                )}
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Reminder Settings</p>
                  <p className="text-blue-700 text-sm mt-1">
                    SMS reminders are enabled for this medication. You'll receive alerts 15 minutes before each dose.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowMedicineDetails(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleMarkMedicineTaken(selectedMedicine.id);
                    setShowMedicineDetails(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark as Taken
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;