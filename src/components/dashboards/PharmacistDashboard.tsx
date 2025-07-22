import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LogOut, Search, Package, CheckCircle, Clock, User, Plus, Eye, Pill, Calendar, FileText, AlertTriangle } from 'lucide-react';

const PharmacistDashboard = () => {
  const { user, logout } = useAuth();
  const { prescriptions, patients } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchPatientId, setSearchPatientId] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [showPrescriptionDetails, setShowPrescriptionDetails] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [dispensedMedicines, setDispensedMedicines] = useState<string[]>([]);

  const handlePatientSearch = () => {
    if (!searchPatientId.trim()) {
      setSearchResults([]);
      return;
    }
    
    const patientPrescriptions = prescriptions.filter(p => 
      p.patientId.toLowerCase().includes(searchPatientId.toLowerCase()) ||
      patients.find(patient => patient.id === p.patientId)?.name.toLowerCase().includes(searchPatientId.toLowerCase())
    );
    setSearchResults(patientPrescriptions);
  };

  const handleMarkMedicineAsGiven = (prescriptionId: string, medicineId: string) => {
    const key = `${prescriptionId}-${medicineId}`;
    if (!dispensedMedicines.includes(key)) {
      setDispensedMedicines([...dispensedMedicines, key]);
      // In a real app, this would update the database
      console.log(`Medicine ${medicineId} from prescription ${prescriptionId} marked as dispensed`);
    }
  };

  const handleAddMedicineSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // In a real app, this would save to database
    console.log('Medicine schedule added:', {
      patientId: formData.get('patientId'),
      medicineName: formData.get('medicineName'),
      dosage: formData.get('dosage'),
      frequency: formData.get('frequency'),
      timing: formData.get('timing'),
      foodInstructions: formData.get('foodInstructions')
    });
    
    setShowMedicineForm(false);
  };

  const isMedicineDispensed = (prescriptionId: string, medicineId: string) => {
    return dispensedMedicines.includes(`${prescriptionId}-${medicineId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pharmacist Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.name}</p>
              <p className="text-sm text-purple-600">Pharmacist ID: {user?.id}</p>
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
              <div className="bg-purple-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
                <p className="text-gray-600">Total Prescriptions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{dispensedMedicines.length}</p>
                <p className="text-gray-600">Medicines Dispensed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {prescriptions.filter(p => p.status === 'active').length - dispensedMedicines.length}
                </p>
                <p className="text-gray-600">Pending Requests</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                <p className="text-gray-600">Active Patients</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Package },
                { id: 'search', label: 'Patient Search', icon: Search },
                { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
                { id: 'inventory', label: 'Inventory', icon: Pill }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
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
                  {/* Recent Prescriptions */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Prescriptions</h3>
                      <button
                        onClick={() => setActiveTab('prescriptions')}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-3">
                      {prescriptions.slice(0, 3).map((prescription) => {
                        const patient = patients.find(p => p.id === prescription.patientId);
                        return (
                          <div key={prescription.id} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-md transition-shadow">
                            <div>
                              <p className="font-medium text-gray-900">{patient?.name}</p>
                              <p className="text-sm text-gray-600">ID: {prescription.patientId}</p>
                              <p className="text-xs text-gray-500">{prescription.medicines.length} medicines</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                {prescription.status}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedPrescription(prescription);
                                  setShowPrescriptionDetails(true);
                                }}
                                className="p-1 text-purple-600 hover:text-purple-700"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {prescriptions.length === 0 && (
                        <div className="text-center py-8">
                          <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">No prescriptions available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Today's Tasks */}
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Tasks</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div>
                          <p className="font-medium text-gray-900">Dispense Lisinopril</p>
                          <p className="text-sm text-gray-600">Patient: John Smith</p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                        <div>
                          <p className="font-medium text-gray-900">Prepare Medicine Schedule</p>
                          <p className="text-sm text-gray-600">Patient: Mary Johnson</p>
                        </div>
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Verify Prescription</p>
                          <p className="text-sm text-gray-600">Patient: Robert Davis</p>
                        </div>
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => setActiveTab('search')}
                      className="flex flex-col items-center p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                    >
                      <Search className="h-8 w-8 text-purple-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Search Patient</span>
                    </button>
                    
                    <button
                      onClick={() => setShowMedicineForm(true)}
                      className="flex flex-col items-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      <Plus className="h-8 w-8 text-green-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Add Medicine Schedule</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('prescriptions')}
                      className="flex flex-col items-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <FileText className="h-8 w-8 text-blue-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">View Prescriptions</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="flex flex-col items-center p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                    >
                      <Pill className="h-8 w-8 text-orange-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Check Inventory</span>
                    </button>
                  </div>
                </div>

                {/* Daily Statistics */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{dispensedMedicines.length}</div>
                      <div className="text-sm text-gray-600">Medicines Dispensed</div>
                      <div className="text-xs text-gray-500 mt-1">Today</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {prescriptions.filter(p => p.status === 'active').length}
                      </div>
                      <div className="text-sm text-gray-600">Active Prescriptions</div>
                      <div className="text-xs text-gray-500 mt-1">Total</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
                      <div className="text-sm text-gray-600">Patients Served</div>
                      <div className="text-xs text-gray-500 mt-1">This month</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Patient Search Tab */}
            {activeTab === 'search' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Search Patient Prescriptions</h3>
                    <p className="text-sm text-gray-600">Enter patient ID or name to find their prescriptions</p>
                  </div>
                </div>
                
                <div className="bg-white border rounded-lg p-6 mb-6">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Enter Patient ID or Name"
                        value={searchPatientId}
                        onChange={(e) => setSearchPatientId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        onKeyPress={(e) => e.key === 'Enter' && handlePatientSearch()}
                      />
                    </div>
                    <button
                      onClick={handlePatientSearch}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                      <Search className="h-5 w-5" />
                      <span>Search</span>
                    </button>
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-6">
                    <h4 className="text-md font-semibold text-gray-900">Search Results ({searchResults.length})</h4>
                    {searchResults.map((prescription) => {
                      const patient = patients.find(p => p.id === prescription.patientId);
                      return (
                        <div key={prescription.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h5 className="text-lg font-semibold text-gray-900">{patient?.name}</h5>
                              <p className="text-gray-600">Patient ID: {prescription.patientId}</p>
                              <p className="text-sm text-gray-500">Prescribed on {prescription.date}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>Age: {patient?.age}</span>
                                <span>•</span>
                                <span>Phone: {patient?.phone}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`text-xs px-3 py-1 rounded-full ${
                                prescription.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {prescription.status}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedPrescription(prescription);
                                  setShowPrescriptionDetails(true);
                                }}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {prescription.medicines.map((medicine) => {
                              const isDispensed = isMedicineDispensed(prescription.id, medicine.id);
                              return (
                                <div key={medicine.id} className={`p-4 rounded-lg border ${
                                  isDispensed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-900">{medicine.name}</p>
                                      <p className="text-sm text-gray-600">
                                        {medicine.dosage} - {medicine.frequency}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {medicine.beforeFood ? 'Before food' : 'After food'}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Duration: {medicine.startDate} to {medicine.endDate}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {isDispensed ? (
                                        <div className="flex items-center space-x-2 text-green-600">
                                          <CheckCircle className="h-5 w-5" />
                                          <span className="text-sm font-medium">Dispensed</span>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => handleMarkMedicineAsGiven(prescription.id, medicine.id)}
                                          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                                        >
                                          Mark as Given
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {prescription.notes && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm font-medium text-blue-800">Doctor's Notes:</p>
                              <p className="text-blue-700 mt-1">{prescription.notes}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {searchPatientId && searchResults.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No prescriptions found for "{searchPatientId}"</p>
                    <p className="text-sm text-gray-400 mt-2">Try searching with a different patient ID or name</p>
                  </div>
                )}
              </div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">All Prescriptions</h3>
                    <p className="text-sm text-gray-600">Manage and dispense patient medications</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Total: {prescriptions.length}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {prescriptions.map((prescription) => {
                    const patient = patients.find(p => p.id === prescription.patientId);
                    return (
                      <div key={prescription.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{patient?.name}</h4>
                            <p className="text-gray-600">Patient ID: {prescription.patientId}</p>
                            <p className="text-sm text-gray-500">Prescribed on {prescription.date}</p>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                              <span>Age: {patient?.age}</span>
                              <span>•</span>
                              <span>Health Issue: {patient?.healthIssue}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`text-xs px-3 py-1 rounded-full ${
                              prescription.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {prescription.status}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedPrescription(prescription);
                                setShowPrescriptionDetails(true);
                              }}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {prescription.medicines.map((medicine) => {
                            const isDispensed = isMedicineDispensed(prescription.id, medicine.id);
                            return (
                              <div key={medicine.id} className={`p-4 rounded-lg ${
                                isDispensed ? 'bg-green-50' : 'bg-gray-50'
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">{medicine.name}</p>
                                    <p className="text-sm text-gray-600">
                                      {medicine.dosage} - {medicine.frequency}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Duration: {medicine.startDate} to {medicine.endDate}
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
                                    {isDispensed && (
                                      <div className="flex items-center space-x-1 mt-2 text-green-600">
                                        <CheckCircle className="h-4 w-4" />
                                        <span className="text-xs">Dispensed</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <div className="text-sm text-gray-500">
                            Dispensed: {prescription.medicines.filter(m => isMedicineDispensed(prescription.id, m.id)).length} / {prescription.medicines.length}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedPrescription(prescription);
                                setShowPrescriptionDetails(true);
                              }}
                              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                            >
                              View Details
                            </button>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                              Print Label
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {prescriptions.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No prescriptions available.</p>
                  </div>
                )}
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Medicine Inventory</h3>
                    <p className="text-sm text-gray-600">Track medicine stock and availability</p>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Add New Medicine
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Lisinopril', stock: 150, minStock: 50, status: 'good' },
                    { name: 'Aspirin', stock: 25, minStock: 50, status: 'low' },
                    { name: 'Metformin', stock: 200, minStock: 100, status: 'good' },
                    { name: 'Atorvastatin', stock: 5, minStock: 30, status: 'critical' },
                    { name: 'Amlodipine', stock: 80, minStock: 40, status: 'good' },
                    { name: 'Omeprazole', stock: 35, minStock: 50, status: 'low' }
                  ].map((medicine, index) => (
                    <div key={index} className="bg-white border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">{medicine.name}</h4>
                        <div className={`p-2 rounded-full ${
                          medicine.status === 'good' ? 'bg-green-100' :
                          medicine.status === 'low' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {medicine.status === 'good' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : medicine.status === 'low' ? (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Stock:</span>
                          <span className={`font-medium ${
                            medicine.status === 'good' ? 'text-green-600' :
                            medicine.status === 'low' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {medicine.stock} units
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Minimum Stock:</span>
                          <span className="font-medium text-gray-900">{medicine.minStock} units</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              medicine.status === 'good' ? 'bg-green-600' :
                              medicine.status === 'low' ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${Math.min((medicine.stock / medicine.minStock) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                          Update Stock
                        </button>
                        <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
                          Reorder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Medicine Schedule Form Modal */}
      {showMedicineForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Add Medicine Schedule</h2>
            </div>
            
            <form onSubmit={handleAddMedicineSchedule} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID *
                </label>
                <input
                  type="text"
                  name="patientId"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter patient ID"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    name="medicineName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Aspirin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    name="dosage"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., 100mg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency *
                  </label>
                  <select
                    name="frequency"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Four times daily">Four times daily</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timing *
                  </label>
                  <input
                    type="text"
                    name="timing"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., 8:00 AM, 2:00 PM"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Food Instructions *
                </label>
                <select
                  name="foodInstructions"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select instruction</option>
                  <option value="before">Before food</option>
                  <option value="after">After food</option>
                  <option value="with">With food</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMedicineForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Details Modal */}
      {showPrescriptionDetails && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Prescription Details</h2>
                <button
                  onClick={() => setShowPrescriptionDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {(() => {
                const patient = patients.find(p => p.id === selectedPrescription.patientId);
                return (
                  <div className="space-y-6">
                    {/* Patient Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Patient Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">{patient?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Patient ID</p>
                          <p className="font-medium">{selectedPrescription.patientId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Age</p>
                          <p className="font-medium">{patient?.age}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{patient?.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Prescription Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Prescription Information</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Prescription ID</p>
                          <p className="font-medium">{selectedPrescription.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Date Prescribed</p>
                          <p className="font-medium">{selectedPrescription.date}</p>
                        </div>
                      </div>
                    </div>

                    {/* Medicines */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Medicines</h3>
                      <div className="space-y-4">
                        {selectedPrescription.medicines.map((medicine) => {
                          const isDispensed = isMedicineDispensed(selectedPrescription.id, medicine.id);
                          return (
                            <div key={medicine.id} className={`border rounded-lg p-4 ${
                              isDispensed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                            }`}>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-lg font-semibold text-gray-900">{medicine.name}</h4>
                                {isDispensed ? (
                                  <div className="flex items-center space-x-2 text-green-600">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="text-sm font-medium">Dispensed</span>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleMarkMedicineAsGiven(selectedPrescription.id, medicine.id)}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                                  >
                                    Mark as Given
                                  </button>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Dosage</p>
                                  <p className="font-medium">{medicine.dosage}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Frequency</p>
                                  <p className="font-medium">{medicine.frequency}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Food Instructions</p>
                                  <p className="font-medium">{medicine.beforeFood ? 'Before food' : 'After food'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Duration</p>
                                  <p className="font-medium">{medicine.startDate} to {medicine.endDate}</p>
                                </div>
                              </div>
                              
                              {medicine.instructions && (
                                <div className="mt-3">
                                  <p className="text-gray-600 text-sm">Instructions</p>
                                  <p className="font-medium">{medicine.instructions}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {selectedPrescription.notes && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Doctor's Notes</h3>
                        <p className="text-blue-800">{selectedPrescription.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })()}
              
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowPrescriptionDetails(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Print Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacistDashboard;