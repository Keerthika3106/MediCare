import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LogOut, Heart, AlertTriangle, Calendar, MessageSquare, Phone, Clock } from 'lucide-react';

const CaretakerDashboard = () => {
  const { user, logout } = useAuth();
  const { patients, prescriptions, appointments } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  // Find the patient this caretaker is assigned to
  const assignedPatient = patients.find(p => p.caretakerId === user?.id);
  const patientPrescriptions = prescriptions.filter(p => p.patientId === assignedPatient?.id);
  const patientAppointments = appointments.filter(a => a.patientId === assignedPatient?.id);

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // In a real app, this would send the complaint to the doctor
    console.log('Complaint submitted:', {
      patientId: assignedPatient?.id,
      complaint: formData.get('complaint'),
      urgency: formData.get('urgency')
    });
    
    setShowComplaintForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Caretaker Dashboard</h1>
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
        {assignedPatient && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Caring for: {assignedPatient.name}</h2>
                <p className="text-gray-600">Patient ID: {assignedPatient.id}</p>
                <p className="text-gray-600">Health Issue: {assignedPatient.healthIssue}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Age: {assignedPatient.age}</p>
                <p className="text-sm text-gray-600">Phone: {assignedPatient.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{patientPrescriptions.length}</p>
                <p className="text-gray-600">Active Prescriptions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-gray-600">Missed Medicines</p>
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
              <div className="bg-green-100 p-3 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-gray-600">Reports Sent</p>
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
                { id: 'medicines', label: 'Medicine Tracking', icon: Clock },
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'reports', label: 'Reports', icon: MessageSquare }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
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
                  {/* Today's Medicine Schedule */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Medicine Schedule</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div>
                          <p className="font-medium text-gray-900">Lisinopril 10mg</p>
                          <p className="text-sm text-gray-600">8:00 AM - Taken ✓</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Completed
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div>
                          <p className="font-medium text-gray-900">Aspirin 81mg</p>
                          <p className="text-sm text-gray-600">2:00 PM - Missed</p>
                        </div>
                        <div className="text-right">
                          <button className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors">
                            Mark as Taken
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Vitamin D</p>
                          <p className="text-sm text-gray-600">8:00 PM - Upcoming</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowComplaintForm(true)}
                        className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="h-5 w-5 text-orange-600" />
                          <span className="font-medium text-gray-900">Report to Doctor</span>
                        </div>
                        <span className="text-gray-400">→</span>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('appointments')}
                        className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-gray-900">Schedule Appointment</span>
                        </div>
                        <span className="text-gray-400">→</span>
                      </button>
                      
                      <button 
                        onClick={() => window.open('tel:911', '_self')}
                        className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-gray-900">Emergency Contact</span>
                        </div>
                        <span className="text-gray-400">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medicine Tracking Tab */}
            {activeTab === 'medicines' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medicine Intake Tracking</h3>
                <div className="space-y-4">
                  {patientPrescriptions.map((prescription) => (
                    <div key={prescription.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Prescription #{prescription.id}</h4>
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
                              <div className="flex space-x-2">
                                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                                  Mark Taken
                                </button>
                                <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                                  Mark Missed
                                </button>
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
                  <h3 className="text-lg font-semibold text-gray-900">Patient Appointments</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Schedule New Appointment
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
                        
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">+1-555-0101</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Reports & Complaints</h3>
                  <button
                    onClick={() => setShowComplaintForm(true)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    New Report
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">Medicine Adherence Report</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Sent
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">Patient has been missing afternoon medications consistently.</p>
                    <p className="text-sm text-gray-500">Sent on 2024-01-18</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">Health Concern</h4>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Pending
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">Patient complained of dizziness after taking morning medication.</p>
                    <p className="text-sm text-gray-500">Sent on 2024-01-17</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complaint Form Modal */}
      {showComplaintForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Report to Doctor</h2>
            
            <form onSubmit={handleSubmitComplaint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency Level
                </label>
                <select
                  name="urgency"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select urgency</option>
                  <option value="low">Low - General update</option>
                  <option value="medium">Medium - Needs attention</option>
                  <option value="high">High - Urgent response needed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Details
                </label>
                <textarea
                  name="complaint"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe the situation, symptoms, or concerns..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowComplaintForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaretakerDashboard;