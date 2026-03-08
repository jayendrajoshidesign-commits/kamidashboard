import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/services/apiService';

export function useApiConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [checking, setChecking] = useState(true);

  const check = useCallback(async () => {
    try {
      const result = await api.getAgents();
      // API returns { agents: [...] } object, not a plain array
      setIsConnected(Array.isArray(result) || (result && Array.isArray((result as any).agents)));
    } catch {
      setIsConnected(false);
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, [check]);

  return { isConnected, checking };
}

/**
 * Poll an API endpoint with mock fallback.
 * Returns live data when backend is connected, mock data otherwise.
 */
export function usePolledData<T>(
  fetcher: () => Promise<T>,
  mockFallback: () => T,
  intervalMs: number,
  isConnected: boolean,
) {
  const [data, setData] = useState<T>(mockFallback);
  const [isLive, setIsLive] = useState(false);
  const mockFallbackRef = useRef(mockFallback);
  mockFallbackRef.current = mockFallback;

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      if (!isConnected) {
        setIsLive(false);
        return;
      }
      try {
        const result = await fetcher();
        if (!cancelled) {
          setData(result);
          setIsLive(true);
        }
      } catch {
        if (!cancelled) {
          setIsLive(false);
        }
      }
    };

    poll();
    const id = setInterval(poll, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [isConnected, intervalMs, fetcher]);

  return { data, isLive };
}
