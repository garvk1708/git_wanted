import { useState, useEffect, useCallback } from 'react';
import { AuthUser } from '@shared/types';
import { useToast } from './use-toast';

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching current user...');
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          console.log('User authenticated:', userData.username);
          setUser(userData);
        } else if (response.status !== 401) {
          // Only show error for non-401 responses (401 just means not logged in)
          console.error('Error fetching user data:', response.status, response.statusText);
          setError('Failed to fetch user data');
          toast({
            title: 'Error',
            description: 'Failed to fetch user data',
            variant: 'destructive',
          });
        } else {
          console.log('User not authenticated (401)');
        }
      } catch (err) {
        console.error('Error in auth check:', err);
        setError('Failed to check authentication status');
        toast({
          title: 'Error',
          description: 'Failed to check authentication status',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Check for GitHub OAuth callback
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      handleOAuthCallback(code)
        .then(fetchCurrentUser)
        .catch((err) => {
          console.error('Failed to handle OAuth callback:', err);
          setError('Failed to complete authentication');
          setIsLoading(false);
          toast({
            title: 'Authentication Failed',
            description: err instanceof Error ? err.message : 'Unknown error',
            variant: 'destructive',
          });
        });
    } else {
      fetchCurrentUser();
    }
  }, [toast]);

  // Handle OAuth callback
  const handleOAuthCallback = async (code: string): Promise<void> => {
    try {
      console.log('Handling OAuth callback with code...');
      
      // Use the manual exchange endpoint
      const response = await fetch(`/api/auth/github/manual-exchange?code=${code}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        console.log('Authentication successful:', data.user.username);
        setUser(data.user);
        
        // Clear the URL parameters
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, document.title, url.toString());
        
        toast({
          title: 'Logged In',
          description: `Welcome, ${data.user.username}!`,
        });
      } else {
        throw new Error('Authentication response missing user data');
      }
    } catch (err) {
      console.error('OAuth callback error:', err);
      throw err;
    }
  };

  // Login with GitHub
  const login = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Initiating GitHub login...');
      
      // Get auth URL from the server
      const response = await fetch('/api/auth/github');
      const data = await response.json();
      
      if (data.authUrl) {
        console.log('Redirecting to GitHub:', data.authUrl);
        window.location.href = data.authUrl;
      } else {
        throw new Error('Failed to get GitHub authorization URL');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to initiate login');
      toast({
        title: 'Login Failed',
        description: err instanceof Error ? err.message : 'Failed to start login process',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  }, [toast]);

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      
      setUser(null);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
      });
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
      toast({
        title: 'Logout Failed',
        description: 'Failed to log out properly',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { user, isLoading, error, login, logout };
}