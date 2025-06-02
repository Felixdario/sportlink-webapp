"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import type { User } from '@/lib/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: ReturnType<typeof useAuth>['login'];
  register: ReturnType<typeof useAuth>['register'];
  verifyEmail: ReturnType<typeof useAuth>['verifyEmail'];
  resendVerification: ReturnType<typeof useAuth>['resendVerification'];
  logout: ReturnType<typeof useAuth>['logout'];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const auth = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      const user = await auth.getCurrentUser();
      setUser(user);
    };

    loadUser();
  }, [auth]);

  const value = {
    user,
    loading: auth.loading,
    error: auth.error,
    login: auth.login,
    register: auth.register,
    verifyEmail: auth.verifyEmail,
    resendVerification: auth.resendVerification,
    logout: auth.logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 