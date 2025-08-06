import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Configure axios defaults
const API_BASE_URL = 'http://localhost:5000/api';
axios.defaults.baseURL = API_BASE_URL;

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
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const token = localStorage.getItem('medicare_token');
    if (token) {
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user data
      verifyToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('medicare_token');
        delete axios.defaults.headers.common['Authorization'];
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('medicare_token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await axios.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, user: userData } = response.data;
        
        // Store token
        localStorage.setItem('medicare_token', token);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Set user data
        setUser(userData);
        
        setIsLoading(false);
        return true;
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data?.message || error.message);
      setIsLoading(false);
      return false;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await axios.post('/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        phone: userData.phone,
        specialization: userData.specialization,
        assignedDoctor: userData.assignedDoctor,
        patientId: userData.patientId,
        healthIssue: userData.healthIssue,
        age: userData.age
      });
      
      if (response.data.success) {
        const { token, user: newUser } = response.data;
        
        // Store token
        localStorage.setItem('medicare_token', token);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Set user data
        setUser(newUser);
        
        setIsLoading(false);
        return true;
      }
    } catch (error: any) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      setIsLoading(false);
      return false;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicare_token');
    delete axios.defaults.headers.common['Authorization'];
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