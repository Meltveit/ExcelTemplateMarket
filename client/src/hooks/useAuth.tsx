import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // In this simplified implementation, we're just checking if the admin credentials
  // are correct in basic auth. In a real app, this would use a proper auth system.
  const checkAuthentication = async () => {
    setIsLoading(true);
    try {
      // We'll just make a request to an admin-only endpoint to see if we're authenticated
      await apiRequest('GET', '/api/admin/templates');
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Use the provided email and password directly
      // The server now supports these credentials
      const credentials = btoa(`${email}:${password}`);
      localStorage.setItem('auth', credentials);
      
      // Try to fetch admin data to verify credentials
      await apiRequest('GET', '/api/admin/templates');
      
      setIsAuthenticated(true);
      toast({
        title: 'Login successful',
        description: 'Welcome to the admin panel',
      });
      return true;
    } catch (error) {
      localStorage.removeItem('auth');
      setIsAuthenticated(false);
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}

export default useAuth;
