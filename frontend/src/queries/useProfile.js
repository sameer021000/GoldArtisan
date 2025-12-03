import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiBase = process.env.REACT_APP_API_BASE || 'http://localhost:7000';

async function fetchProfile()
{
    const token = localStorage.getItem('GoldArtisanToken');
    if (!token)
    {
      // return null when no token — query will be disabled in components normally
      throw { message: 'No token', status: 401 };
    }

    const res = await axios.get(`${apiBase}/Operations/getGAFullName`,
    {
      headers: { Authorization: `Bearer ${token}` },
    });

    // if backend uses a different shape adjust here
    if (res?.data?.success && res.data.data)
    {
      const { firstName = '', lastName = '' } = res.data.data;
      const fullName = `${firstName} ${lastName}`.trim() || 'COMer';
      return { fullName };
    }

  throw { message: 'Unable to fetch profile' };
}

/*
 * useProfile hook:
 * - key: ['profile']
 * - enabled: only run fetch when token exists
 * - React Query caches result and shares it across components
 */
export function useProfile(options = {})
{
    const token = typeof window !== 'undefined' ? localStorage.getItem('GoldArtisanToken') : null;

    return useQuery(
      ['profile'],
      fetchProfile,
      {
            enabled: !!token, // if not signed-in, don't run
            staleTime: 5 * 60 * 1000, // 5 minutes fresh
            cacheTime: 15 * 60 * 1000,
            retry: false,
            ...options,
      }
    );
}
