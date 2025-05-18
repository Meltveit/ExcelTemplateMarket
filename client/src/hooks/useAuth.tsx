import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication against the database through the server
  const checkAuthentication = async () => {
    setIsLoading(true);
    try {
      // Use our dedicated auth check endpoint to verify authentication
      const response = await apiRequest('GET', '/api/admin/check-auth');
      const data = await response.json();
      
      if (data.authenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      // If there's an error or 401, we're not authenticated
      setIsAuthenticated(false);
      localStorage.removeItem('auth'); // Clear any invalid credentials
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
      // Store credentials in localStorage for API requests
      const credentials = btoa(`${email}:${password}`);
      localStorage.setItem('auth', credentials);
      
      // Verify credentials against our auth check endpoint
      const response = await apiRequest('GET', '/api/admin/check-auth');
      const data = await response.json();
      
      if (data.authenticated) {
        setIsAuthenticated(true);
        toast({
          title: 'Login successful',
          description: 'Welcome to the admin panel',
        });
        return true;
      } else {
        // This shouldn't normally happen, but just in case
        throw new Error('Authentication failed');
      }
    } catch (error) {
      // Clear invalid credentials
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
