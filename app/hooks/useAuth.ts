import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UseAuthReturn {
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      router.push('/page/login');
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: include cookies
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear any client-side state
      localStorage.removeItem('user');
      sessionStorage.clear();

      // Redirect to login page
   
      router.refresh(); // Refresh to clear any server-side state
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
}