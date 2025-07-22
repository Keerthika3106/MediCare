import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'patient' | 'pharmacist' | 'caretaker' | 'family';
  specialization?: string;
  phone?: string;
  assignedPatients?: string[];
  assignedDoctor?: string;
  patientId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for development
const demoUsers: (User & { password: string })[] = [
  {
    id: 'DOC001',
    name: 'Dr. Sarah Johnson',
    email: 'doctor@medicare.com',
    password: 'password',
    role: 'doctor',
    specialization: 'Cardiology',
    phone: '+1-555-0101',
    assignedPatients: ['PAT001', 'PAT002']
  },
  {
    id: 'PAT001',
    name: 'John Smith',
    email: 'patient@medicare.com',
    password: 'password',
    role: 'patient',
    phone: '+1-555-0102',
    assignedDoctor: 'DOC001'
  },
  {
    id: 'PHR001',
    name: 'Mike Wilson',
    email: 'pharmacist@medicare.com',
    password: 'password',
    role: 'pharmacist',
    phone: '+1-555-0103'
  },
  {
    id: 'CAR001',
    name: 'Emma Davis',
    email: 'caretaker@medicare.com',
    password: 'password',
    role: 'caretaker',
    phone: '+1-555-0104',
    patientId: 'PAT001'
  },
  {
    id: 'FAM001',
    name: 'Robert Smith',
    email: 'family@medicare.com',
    password: 'password',
    role: 'family',
    phone: '+1-555-0105',
    patientId: 'PAT001'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app load
    const storedUser = localStorage.getItem('medicare_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = demoUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('medicare_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate ID based on role
    const rolePrefix = userData.role.toUpperCase().substring(0, 3);
    const id = `${rolePrefix}${String(demoUsers.length + 1).padStart(3, '0')}`;
    
    const newUser: User = {
      id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      specialization: userData.specialization,
      phone: userData.phone,
      assignedPatients: userData.assignedPatients,
      assignedDoctor: userData.assignedDoctor,
      patientId: userData.patientId
    };
    
    // Add to demo users (in real app, this would be API call)
    demoUsers.push({ ...newUser, password: userData.password });
    
    setUser(newUser);
    localStorage.setItem('medicare_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicare_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};