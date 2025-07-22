import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LogOut, Users, Calendar, FileText, Plus, Search, Eye, Edit, Trash2, Phone, Mail, Clock, CheckCircle, AlertTriangle, Activity, Heart, Stethoscope, User, Pill, MessageSquare } from 'lucide-react';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const { patients, prescriptions, appointments, addPrescription, addAppointment, updateAppointmentStatus } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showVisitReportForm, setShowVisitReportForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', instructions: '', beforeFood: true, startDate: '', endDate: '' }]);

  // Filter data for current doctor
  const doctorPatients = patients.filter(p => p.doctorId === user?.id);
  const doctorAppointments = appointments.filter(a => a.doctorId === user?.id);
  const doctorPrescriptions = prescriptions.filter(p => p.doctorId === user?.id);

  // Filter patients based on search
  const filteredPatients = doctorPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.healthIssue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', instructions: '', beforeFood: true, startDate: '', endDate: '' }]);
  };

  const handleRemoveMedicine = (index: number) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const handleMedicineChange = (index: number, field: string, value: any) => {
    const updatedMedicines = medicines.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    );
    setMedicines(updatedMedicines);
  };

  const handleSubmitPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const prescription = {
      patientId: formData.get('patientId') as string,
      doctorId: user?.id || '',
      medicines: medicines.map((med, index) => ({
        id: `MED${Date.now()}_${index}`,
        ...med
      })),
      date: new Date().toISOString().split('T')[0],
      notes: formData.get('notes') as string,
      status: 'active' as const
    };
    
    addPrescription(prescription);
    setShowPrescriptionForm(false);
    setMedicines([{ name: '', dosage: '', frequency: '', instructions: '', beforeFood: true, startDate: '', endDate: '' }]);
  };

  const handleSubmitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const appointment = {
      patientId: formData.get('patientId') as string,
      doctorId: user?.id || '',
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      reason: formData.get('reason') as string,
      status: 'confirmed' as const,
      notes: formData.get('notes') as string
    };
    
    addAppointment(appointment);
    setShowAppointmentForm(false);
  };

  const handleSubmitVisitReport = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // In a real app, this would save to database
    console.log('Visit report submitted:', {
      patientId: selectedPatient?.id,
      symptoms: formData.get('symptoms'),
      diagnosis: formData.get('diagnosis'),
      treatment: formData.get('treatment'),
      followUp: formData.get('followUp'),
      date: new Date().toISOString().split('T')[0]
    });
    
    setShowVisitReportForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.name}</p>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-blue-600">Dr. ID: {user?.id}</p>
                <p className="text-sm text-gray-500">•</p>
                <p className="text-sm text-gray-600">{user?.specialization}</p>
              </div>
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
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{doctorPatients.length}</p>
                <p className="text-gray-600">Total Patients</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{doctorAppointments.length}</p>
                <p className="text-gray-600">Appointments</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{doctorPrescriptions.length}</p>
                <p className="text-gray-600">Prescriptions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {doctorAppointments.filter(a => a.status === 'pending').length}
                </p>
                <p className="text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Stethoscope },
                { id: 'patients', label: 'My Patients', icon: Users },
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
                { id: 'reports', label: 'Reports', icon: MessageSquare }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
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
                  {/* Today's Schedule */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="space-y-3">
                      {doctorAppointments.slice(0, 3).map((appointment) => {
                        const patient = doctorPatients.find(p => p.id === appointment.patientId);
                        return (
                          <div key={appointment.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{patient?.name}</p>
                              <p className="text-sm text-gray-600">{appointment.time} - {appointment.reason}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              appointment.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Patients */}
                  <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="space-y-3">
                      {doctorPatients.slice(0, 3).map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div>
                            <p className="font-medium text-gray-900">{patient.name}</p>
                            <p className="text-sm text-gray-600">{patient.healthIssue}</p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setShowPatientDetails(true);
                            }}
                            className="p-1 text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => setShowPrescriptionForm(true)}
                      className="flex flex-col items-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Pill className="h-8 w-8 text-blue-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">New Prescription</span>
                    </button>
                    
                    <button
                      onClick={() => setShowAppointmentForm(true)}
                      className="flex flex-col items-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      <Calendar className="h-8 w-8 text-green-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Schedule Appointment</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('patients')}
                      className="flex flex-col items-center p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                    >
                      <Users className="h-8 w-8 text-purple-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">View Patients</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="flex flex-col items-center p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                    >
                      <FileText className="h-8 w-8 text-orange-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">View Reports</span>
                    </button>
                  </div>
                </div>

                {/* Health Statistics */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Health Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-gray-600">Average Medicine Adherence</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {doctorAppointments.filter(a => a.status === 'confirmed').length}
                      </div>
                      <div className="text-sm text-gray-600">Confirmed Appointments</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {doctorPrescriptions.filter(p => p.status === 'active').length}
                      </div>
                      <div className="text-sm text-gray-600">Active Prescriptions</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">My Patients</h3>
                    <p className="text-sm text-gray-600">Manage your patient records and health information</p>
                  </div>
                  <button
                    onClick={() => setShowPatientForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Patient</span>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients by name, ID, or health issue..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Patients Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPatients.map((patient) => (
                    <div key={patient.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{patient.name}</h4>
                            <p className="text-sm text-gray-600">ID: {patient.id}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setShowPatientDetails(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setShowVisitReportForm(true);
                            }}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Age:</span>
                          <span className="font-medium">{patient.age}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Health Issue:</span>
                          <span className="font-medium text-red-600">{patient.healthIssue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{patient.phone}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowPrescriptionForm(true);
                          }}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Prescribe
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowAppointmentForm(true);
                          }}
                          className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPatients.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? `No patients found matching "${searchTerm}"` : 'No patients assigned yet.'}
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={() => setShowPatientForm(true)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Your First Patient
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
                    <p className="text-sm text-gray-600">Manage patient appointments and schedules</p>
                  </div>
                  <button
                    onClick={() => setShowAppointmentForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Appointment</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {doctorAppointments.map((appointment) => {
                    const patient = doctorPatients.find(p => p.id === appointment.patientId);
                    return (
                      <div key={appointment.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h4 className="text-lg font-semibold text-gray-900">{patient?.name}</h4>
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
                            <p className="text-sm text-gray-500">Patient ID: {appointment.patientId}</p>
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
                              <span>{patient?.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Mail className="h-4 w-4" />
                              <span>{patient?.email}</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && (
                              <>
                                <button
                                  onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedPatient(patient);
                                    setShowVisitReportForm(true);
                                  }}
                                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                                >
                                  Add Report
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {doctorAppointments.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments scheduled.</p>
                    <button
                      onClick={() => setShowAppointmentForm(true)}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Schedule First Appointment
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Prescriptions</h3>
                    <p className="text-sm text-gray-600">Manage patient medications and treatment plans</p>
                  </div>
                  <button
                    onClick={() => setShowPrescriptionForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Prescription</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {doctorPrescriptions.map((prescription) => {
                    const patient = doctorPatients.find(p => p.id === prescription.patientId);
                    return (
                      <div key={prescription.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{patient?.name}</h4>
                            <p className="text-gray-600">Patient ID: {prescription.patientId}</p>
                            <p className="text-sm text-gray-500">Prescribed on {prescription.date}</p>
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
                                <div>
                                  <p className="font-semibold text-gray-900">{medicine.name}</p>
                                  <p className="text-sm text-gray-600">
                                    {medicine.dosage} - {medicine.frequency}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className={`text-xs px-2 py-1 rounded ${
                                    medicine.beforeFood 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {medicine.beforeFood ? 'Before food' : 'After food'}
                                  </p>
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
                            <p className="text-sm font-medium text-blue-800">Notes:</p>
                            <p className="text-blue-700 mt-1">{prescription.notes}</p>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Edit Prescription
                          </button>
                          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                            View Adherence
                          </button>
                          <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                            Print
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {doctorPrescriptions.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No prescriptions created yet.</p>
                    <button
                      onClick={() => setShowPrescriptionForm(true)}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create First Prescription
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Patient Reports & Feedback</h3>
                    <p className="text-sm text-gray-600">View caretaker reports and patient feedback</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Sample Reports */}
                  <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Medicine Adherence Report</h4>
                        <p className="text-gray-600">From: Emma Davis (Caretaker)</p>
                        <p className="text-sm text-gray-500">Patient: John Smith • Submitted: 2 hours ago</p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Medium Priority
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-gray-700">
                        Patient has been consistently missing the afternoon dose of Aspirin (2:00 PM). 
                        He mentions feeling drowsy after taking it. Please advise if timing can be adjusted 
                        or if there's an alternative medication.
                      </p>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                        Respond
                      </button>
                      <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors">
                        Schedule Call
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Health Concern Report</h4>
                        <p className="text-gray-600">From: Robert Smith (Family Member)</p>
                        <p className="text-sm text-gray-500">Patient: John Smith • Submitted: 1 day ago</p>
                      </div>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        High Priority
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-gray-700">
                        Patient complained of chest discomfort and shortness of breath yesterday evening. 
                        Symptoms lasted about 30 minutes. He's feeling better now but we're concerned. 
                        Should we schedule an emergency appointment?
                      </p>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors">
                        Emergency Response
                      </button>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                        Schedule Urgent Appointment
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Weekly Progress Update</h4>
                        <p className="text-gray-600">From: Emma Davis (Caretaker)</p>
                        <p className="text-sm text-gray-500">Patient: John Smith • Submitted: 3 days ago</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Low Priority
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-gray-700">
                        Patient's overall condition has improved this week. Medicine adherence is at 90%. 
                        Blood pressure readings have been stable. He's more active and his appetite has improved. 
                        Looking forward to the next appointment.
                      </p>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors">
                        Mark as Reviewed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prescription Form Modal */}
      {showPrescriptionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Create New Prescription</h2>
            </div>
            
            <form onSubmit={handleSubmitPrescription} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient *
                </label>
                <select
                  name="patientId"
                  required
                  defaultValue={selectedPatient?.id || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Patient</option>
                  {doctorPatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Medicines</h3>
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Add Medicine
                  </button>
                </div>

                {medicines.map((medicine, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Medicine {index + 1}</h4>
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicine(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Medicine Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={medicine.name}
                          onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Aspirin"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dosage *
                        </label>
                        <input
                          type="text"
                          required
                          value={medicine.dosage}
                          onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 100mg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frequency *
                        </label>
                        <select
                          required
                          value={medicine.frequency}
                          onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select frequency</option>
                          <option value="Once daily">Once daily</option>
                          <option value="Twice daily">Twice daily</option>
                          <option value="Three times daily">Three times daily</option>
                          <option value="Four times daily">Four times daily</option>
                          <option value="As needed">As needed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Food Instructions
                        </label>
                        <select
                          value={medicine.beforeFood ? 'before' : 'after'}
                          onChange={(e) => handleMedicineChange(index, 'beforeFood', e.target.value === 'before')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="before">Before food</option>
                          <option value="after">After food</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={medicine.startDate}
                          onChange={(e) => handleMedicineChange(index, 'startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={medicine.endDate}
                          onChange={(e) => handleMedicineChange(index, 'endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Instructions
                      </label>
                      <textarea
                        rows={2}
                        value={medicine.instructions}
                        onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any special instructions for this medicine..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  General Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes or instructions for the patient..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPrescriptionForm(false);
                    setSelectedPatient(null);
                    setMedicines([{ name: '', dosage: '', frequency: '', instructions: '', beforeFood: true, startDate: '', endDate: '' }]);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Schedule Appointment</h2>
            </div>
            
            <form onSubmit={handleSubmitAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient *
                </label>
                <select
                  name="patientId"
                  required
                  defaultValue={selectedPatient?.id || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Patient</option>
                  {doctorPatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
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
                    Time *
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
                    <option value="5:00 PM">5:00 PM</option>
                  </select>
                </div>
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
                  <option value="Test results review">Test results review</option>
                  <option value="Emergency consultation">Emergency consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes for the appointment..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAppointmentForm(false);
                    setSelectedPatient(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {showPatientDetails && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
                <button
                  onClick={() => setShowPatientDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Information */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedPatient.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patient ID:</span>
                      <span className="font-medium">{selectedPatient.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{selectedPatient.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedPatient.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedPatient.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Health Issue:</span>
                      <span className="font-medium text-red-600">{selectedPatient.healthIssue}</span>
                    </div>
                  </div>
                </div>

                {/* Health Status */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Medicine Adherence:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last Visit:</span>
                      <span className="font-medium">Jan 15, 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Next Appointment:</span>
                      <span className="font-medium text-blue-600">Jan 20, 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Overall Status:</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        Stable
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Prescriptions */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Prescriptions</h3>
                <div className="space-y-3">
                  {doctorPrescriptions
                    .filter(p => p.patientId === selectedPatient.id && p.status === 'active')
                    .map((prescription) => (
                      <div key={prescription.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Prescription #{prescription.id}</span>
                          <span className="text-sm text-gray-500">{prescription.date}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {prescription.medicines.map((medicine) => (
                            <div key={medicine.id} className="bg-gray-50 p-2 rounded">
                              <span className="font-medium">{medicine.name}</span> - {medicine.dosage}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowPatientDetails(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowPatientDetails(false);
                    setShowPrescriptionForm(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  New Prescription
                </button>
                <button
                  onClick={() => {
                    setShowPatientDetails(false);
                    setShowVisitReportForm(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Visit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visit Report Form Modal */}
      {showVisitReportForm && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Add Visit Report</h2>
              <p className="text-gray-600">Patient: {selectedPatient.name}</p>
            </div>
            
            <form onSubmit={handleSubmitVisitReport} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms Observed *
                </label>
                <textarea
                  name="symptoms"
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the symptoms observed during the visit..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosis *
                </label>
                <textarea
                  name="diagnosis"
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your diagnosis based on the examination..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment Plan *
                </label>
                <textarea
                  name="treatment"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the treatment plan, medications, lifestyle changes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Follow-up Instructions
                </label>
                <textarea
                  name="followUp"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="When should the patient return? Any specific instructions..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowVisitReportForm(false);
                    setSelectedPatient(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;