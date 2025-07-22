import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LogOut, Users, Heart, Calendar, Bell, Phone, MessageCircle } from 'lucide-react';

const FamilyDashboard = () => {
  const { user, logout } = useAuth();
  const { patients, prescriptions, appointments } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  // Find the patient this family member is associated with
  const associatedPatient = patients.find(p => p.familyMembers?.includes(user?.id || ''));
  const patientPrescriptions = prescriptions.filter(p => p.patientId === associatedPatient?.id);
  const patientAppointments = appointments.filter(a => a.patientId === associatedPatient?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Family Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.name}</p>
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
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Info Card */}
        {associatedPatient && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Monitoring: {associatedPatient.name}</h2>
                <p className="text-gray-600">Patient ID: {associatedPatient.id}</p>
                <p className="text-gray-600">Health Issue: {associatedPatient.healthIssue}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Age: {associatedPatient.age}</p>
                <p className="text-sm text-gray-600">Phone: {associatedPatient.phone}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                    Call Patient
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <div className="bg-pink-100 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">85%</p>
                <p className="text-gray-600">Medicine Adherence</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{patientAppointments.length}</p>
                <p className="text-gray-600">Upcoming Appointments</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-gray-600">Recent Alerts</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">Good</p>
                <p className="text-gray-600">Overall Health</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Heart },
                { id: 'health', label: 'Health Status', icon: Heart },
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'alerts', label: 'Alerts & Updates', icon: Bell }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
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
                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div>
                          <p className="font-medium text-gray-900">Medicine taken on time</p>
                          <p className="text-sm text-gray-600">Lisinopril - 8:00 AM</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          ✓ Completed
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div>
                          <p className="font-medium text-gray-900">Medicine missed</p>
                          <p className="text-sm text-gray-600">Aspirin - 2:00 PM</p>
                        </div>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          ⚠ Missed
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                        <div>
                          <p className="font-medium text-gray-900">Appointment scheduled</p>
                          <p className="text-sm text-gray-600">Dr. Johnson - Jan 20</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          📅 Scheduled
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => window.open(`tel:${associatedPatient?.phone}`, '_self')}
                        className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-gray-900">Call Patient</span>
                        </div>
                        <span className="text-gray-400">→</span>
                      </button>
                      
                      <button 
                        onClick={() => window.open('tel:+1-555-0101', '_self')}
                        className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <MessageCircle className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-gray-900">Contact Doctor</span>
                        </div>
                        <span className="text-gray-400">→</span>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('appointments')}
                        className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-purple-600" />
                          <span className="font-medium text-gray-900">Request Appointment</span>
                        </div>
                        <span className="text-gray-400">→</span>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('alerts')}
                        className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-orange-600" />
                          <span className="font-medium text-gray-900">Set Reminder</span>
                        </div>
                        <span className="text-gray-400">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Health Status Tab */}
            {activeTab === 'health' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Status Overview</h3>
                
                {/* Medicine Adherence */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Medicine Adherence</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">This Week</span>
                    <span className="text-sm font-medium text-gray-900">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                {/* Current Prescriptions */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900">Current Prescriptions</h4>
                  {patientPrescriptions.map((prescription) => (
                    <div key={prescription.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="text-lg font-semibold text-gray-900">Prescription #{prescription.id}</h5>
                          <p className="text-gray-600">Prescribed on {prescription.date}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          prescription.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {prescription.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {prescription.medicines.map((medicine) => (
                          <div key={medicine.id} className="bg-gray-50 p-3 rounded">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{medicine.name}</p>
                                <p className="text-sm text-gray-600">
                                  {medicine.dosage} - {medicine.frequency}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {medicine.beforeFood ? 'Before food' : 'After food'}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
                  <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                    Request New Appointment
                  </button>
                </div>
                
                <div className="space-y-4">
                  {patientAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Dr. Sarah Johnson</h4>
                          <p className="text-gray-600">{appointment.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{appointment.date}</p>
                          <p className="text-sm text-gray-600">{appointment.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appointment.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">+1-555-0101</span>
                          </div>
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Reschedule
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-md font-semibold text-red-800">Medicine Missed</h4>
                        <p className="text-red-700">Aspirin 81mg was not taken at 2:00 PM</p>
                        <p className="text-sm text-red-600">2 hours ago</p>
                      </div>
                      <Bell className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-md font-semibold text-yellow-800">Appointment Reminder</h4>
                        <p className="text-yellow-700">Upcoming appointment with Dr. Johnson tomorrow at 10:00 AM</p>
                        <p className="text-sm text-yellow-600">1 day ago</p>
                      </div>
                      <Calendar className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-md font-semibold text-green-800">Medicine Taken</h4>
                        <p className="text-green-700">Lisinopril 10mg taken successfully at 8:00 AM</p>
                        <p className="text-sm text-green-600">6 hours ago</p>
                      </div>
                      <Heart className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-md font-semibold text-blue-800">Health Update</h4>
                        <p className="text-blue-700">Weekly health report: Medicine adherence improved to 85%</p>
                        <p className="text-sm text-blue-600">3 days ago</p>
                      </div>
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyDashboard;