// src/queries/useProfile.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiBase = process.env.REACT_APP_API_BASE || 'http://localhost:7000';

async function fetchProfile() {
  const token = localStorage.getItem('GoldArtisanToken');
  if (!token) {
    // Throwing an object that resembles an HTTP 401 helps callers identify unauthorized state.
    const err = new Error('No token');
    err.status = 401;
    throw err;
  }

  const res = await axios.get(`${apiBase}/Operations/getGAFullName`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res?.data?.success && res.data.data) {
    const { firstName = '', lastName = '' } = res.data.data;
    const fullName = `${firstName} ${lastName}`.trim() || 'COMer';
    return { fullName };
  }

  const err = new Error('Unable to fetch profile');
  err.status = res?.status || 500;
  throw err;
}

/**
 * useProfile(options)
 * - options uses the object signature react-query expects (you can pass onSuccess/onError etc.)
 * - the query will only run when a token exists (enabled: !!token) unless overridden in options
 */
export function useProfile(options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('GoldArtisanToken') : null;

  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    retry: false,
    ...options,
  });
}
