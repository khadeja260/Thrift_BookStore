import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { users } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('arcadiaReadsUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAdmin(user.role === 'admin');
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      setIsAdmin(user.role === 'admin');
      localStorage.setItem('arcadiaReadsUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('arcadiaReadsUser');
  };

  const register = (name: string, email: string, password: string): boolean => {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    // In a real app, we would make an API call to register the user
    // For this demo, we'll just add to our mock data
    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      email,
      role: 'customer',
      password
    };

    users.push(newUser);
    
    // Log in the new user
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    setIsAdmin(false);
    localStorage.setItem('arcadiaReadsUser', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};