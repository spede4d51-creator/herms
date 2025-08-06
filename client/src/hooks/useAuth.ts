import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { Profile } from '@shared/schema';

export const useAuth = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { user } = await apiClient.getCurrentUser();
        setUser(user);
      } catch (err) {
        console.error('Error getting session:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { user, session } = await apiClient.login(email, password);
      setUser(user);
      return { user, session };
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setError(null);
      // For now, treat signup the same as signin since we auto-create profiles
      const { user, session } = await apiClient.login(email, password);
      setUser(user);
      return { user, session };
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await apiClient.logout();
      setUser(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    profile: user, // For compatibility with existing code
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isSupabaseConfigured: true // Always true for our backend
  };
};