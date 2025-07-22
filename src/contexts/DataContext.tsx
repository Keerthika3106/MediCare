import React, { createContext, useContext, useState, ReactNode } from 'react';

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

// Demo data
const initialPatients: Patient[] = [
  {
    id: 'PAT001',
    name: 'John Smith',
    age: 45,
    phone: '+1-555-0102',
    email: 'patient@medicare.com',
    healthIssue: 'Hypertension',
    doctorId: 'DOC001',
    caretakerId: 'CAR001',
    familyMembers: ['FAM001']
  },
  {
    id: 'PAT002',
    name: 'Mary Johnson',
    age: 62,
    phone: '+1-555-0106',
    email: 'mary@medicare.com',
    healthIssue: 'Diabetes Type 2',
    doctorId: 'DOC001'
  }
];

const initialPrescriptions: Prescription[] = [
  {
    id: 'PRE001',
    patientId: 'PAT001',
    doctorId: 'DOC001',
    date: '2024-01-15',
    status: 'active',
    notes: 'Continue for 30 days, monitor blood pressure',
    medicines: [
      {
        id: 'MED001',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        instructions: 'Take in the morning',
        beforeFood: false,
        startDate: '2024-01-15',
        endDate: '2024-02-15'
      },
      {
        id: 'MED002',
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        instructions: 'Take with food',
        beforeFood: false,
        startDate: '2024-01-15',
        endDate: '2024-02-15'
      }
    ]
  }
];

const initialAppointments: Appointment[] = [
  {
    id: 'APP001',
    patientId: 'PAT001',
    doctorId: 'DOC001',
    date: '2024-01-20',
    time: '10:00 AM',
    status: 'confirmed',
    reason: 'Follow-up visit'
  },
  {
    id: 'APP002',
    patientId: 'PAT002',
    doctorId: 'DOC001',
    date: '2024-01-22',
    time: '2:00 PM',
    status: 'pending',
    reason: 'Regular check-up'
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [patients] = useState<Patient[]>(initialPatients);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [medicineIntakes, setMedicineIntakes] = useState<MedicineIntake[]>([]);

  const addPrescription = (prescription: Omit<Prescription, 'id'>) => {
    const newPrescription = {
      ...prescription,
      id: `PRE${String(prescriptions.length + 1).padStart(3, '0')}`
    };
    setPrescriptions(prev => [...prev, newPrescription]);
  };

  const updateMedicineIntake = (intakeId: string, status: 'taken' | 'missed' | 'skipped', confirmedBy?: string) => {
    setMedicineIntakes(prev =>
      prev.map(intake =>
        intake.id === intakeId
          ? { ...intake, status, takenTime: status === 'taken' ? new Date().toISOString() : undefined, confirmedBy }
          : intake
      )
    );
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = {
      ...appointment,
      id: `APP${String(appointments.length + 1).padStart(3, '0')}`
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status }
          : appointment
      )
    );
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