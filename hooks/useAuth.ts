"use client"

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import type {
  RegisterData,
  LoginData,
  VerifyEmailData,
  ResendVerificationData,
  AuthResponse,
  User,
} from '@/lib/types/auth';

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<AuthResponse>('/auth/register', data);
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar usuário');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const login = useCallback(async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<AuthResponse>('/auth/login', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        router.push('/dashboard');
      }
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const verifyEmail = useCallback(async (data: VerifyEmailData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<AuthResponse>('/auth/verify-email', data);
      router.push('/login');
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao verificar email');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const resendVerification = useCallback(async (data: ResendVerificationData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<AuthResponse>('/auth/resend-verification', data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao reenviar código');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    router.push('/login');
  }, [router]);

  const getCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const response = await api.get<User>('/auth/users/me');
      return response.data;
    } catch (err) {
      return null;
    }
  }, []);

  return {
    register,
    login,
    verifyEmail,
    resendVerification,
    logout,
    getCurrentUser,
    loading,
    error,
  };
} 