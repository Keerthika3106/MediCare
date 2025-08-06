import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  beforeFood: boolean;
  startDate: string;
  endDate: string;
}

interface MedicineIntake {
  id: string;
  medicineId: string;
  patientId: string;
  scheduledTime: string;
  takenTime?: string;
  status: 'pending' | 'taken' | 'missed' | 'skipped';
  confirmedBy?: string;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
}

interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medicines: Medicine[];
  date: string;
  notes: string;
  status: 'active' | 'completed' | 'discontinued';
}

interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  healthIssue: string;
  doctorId: string;
  caretakerId?: string;
  familyMembers?: string[];
}

interface DataContextType {
  patients: Patient[];
  prescriptions: Prescription[];
  appointments: Appointment[];
  medicineIntakes: MedicineIntake[];
  addPrescription: (prescription: Omit<Prescription, 'id'>) => void;
  updateMedicineIntake: (intakeId: string, status: 'taken' | 'missed' | 'skipped', confirmedBy?: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicineIntakes, setMedicineIntakes] = useState<MedicineIntake[]>([]);

  // Fetch data functions
  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get('/prescriptions');
      if (response.data.success) {
        setPrescriptions(response.data.prescriptions);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/appointments');
      if (response.data.success) {
        setAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchMedicineIntakes = async () => {
    try {
      const response = await axios.get('/medicine-intakes');
      if (response.data.success) {
        setMedicineIntakes(response.data.intakes);
      }
    } catch (error) {
      console.error('Error fetching medicine intakes:', error);
    }
  };

  // Load data when user changes
  React.useEffect(() => {
    if (user) {
      fetchPrescriptions();
      fetchAppointments();
      fetchMedicineIntakes();
    }
  }, [user]);

  const addPrescription = async (prescription: Omit<Prescription, 'id'>) => {
    try {
      const response = await axios.post('/prescriptions', prescription);
      if (response.data.success) {
        setPrescriptions(prev => [...prev, response.data.prescription]);
        return response.data.prescription;
      }
    } catch (error) {
      console.error('Error adding prescription:', error);
      throw error;
    }
  };

  const updateMedicineIntake = async (intakeId: string, status: 'taken' | 'missed' | 'skipped', confirmedBy?: string) => {
    try {
      const response = await axios.put(`/medicine-intakes/${intakeId}`, {
        status,
        takenTime: status === 'taken' ? new Date().toISOString() : undefined
      });
      if (response.data.success) {
        setMedicineIntakes(prev =>
          prev.map(intake =>
            intake.id === intakeId ? response.data.intake : intake
          )
        );
      }
    } catch (error) {
      console.error('Error updating medicine intake:', error);
      throw error;
    }
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    try {
      const response = await axios.post('/appointments', appointment);
      if (response.data.success) {
        setAppointments(prev => [...prev, response.data.appointment]);
        return response.data.appointment;
      }
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
    try {
      const response = await axios.put(`/appointments/${appointmentId}`, { status });
      if (response.data.success) {
        setAppointments(prev =>
          prev.map(appointment =>
            appointment.id === appointmentId ? response.data.appointment : appointment
          )
        );
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  };

  const value = {
    patients,
    prescriptions,
    appointments,
    medicineIntakes,
    addPrescription,
    updateMedicineIntake,
    addAppointment,
    updateAppointmentStatus
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};