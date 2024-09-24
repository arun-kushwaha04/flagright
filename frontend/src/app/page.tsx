'use client';
import Auth from '@/components/auth';
import Dashboard from '@/components/dashboard';
import { getCookie } from '@/libs/axios';
import { useEffect, useState } from 'react';
import AppReactToastify from './ReactToastifyWrapper';

export default function Home() {
  const [isAuthenticated, setAuthStatus] = useState(false);
  const updateAuthStatus = (value: boolean) => {
    setAuthStatus(value);
  };
  useEffect(() => {
    const cookie = getCookie('token');
    console.log(cookie);
    if (cookie) setAuthStatus(true);
    else setAuthStatus(false);
  }, []);
  return (
    <>
      <AppReactToastify />
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <Auth udpateAuthStatus={updateAuthStatus}></Auth>
      )}
    </>
  );
}
