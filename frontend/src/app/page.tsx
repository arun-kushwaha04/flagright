'use client';
import Auth from '@/components/auth';
import Dashboard from '@/components/dashboard';
import { getAuthStatus } from '@/libs/axios';
import { useEffect, useState } from 'react';
import AppReactToastify from './ReactToastifyWrapper';

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setAuthStatus] = useState(false);
  const updateAuthStatus = (value: boolean) => {
    setAuthStatus(value);
  };
  useEffect(() => {
    const cookie = getAuthStatus();
    if (cookie) setAuthStatus(true);
    else setAuthStatus(false);
    setLoading(false);
  }, []);
  return (
    <>
      {isLoading ? (
        <></> //Loading screen
      ) : (
        <>
          <AppReactToastify />
          {isAuthenticated ? (
            <Dashboard />
          ) : (
            <Auth udpateAuthStatus={updateAuthStatus}></Auth>
          )}
        </>
      )}
    </>
  );
}
