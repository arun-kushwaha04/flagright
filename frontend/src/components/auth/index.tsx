'use client';
import React, { FormEvent, useState } from 'react';

import { Button, TextField, Typography } from '@mui/material';
import { performAPICall, setAuthStatus } from '@/libs/axios';
import { loginRoute, requestType } from '@/libs/endpionts';

export default function Auth(props: {
  udpateAuthStatus: (value: boolean) => void;
}) {
  return <Login udpateAuthStatus={props.udpateAuthStatus}></Login>;
}

function Login(props: { udpateAuthStatus: (value: boolean) => void }) {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123456');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await performAPICall(
      loginRoute,
      requestType.POST,
      {
        email,
        password,
      },
      {
        success: {
          show: true,
          message: 'Login successful',
        },
        error: {
          show: true,
          message: 'Failed to login',
        },
      },
    );
    console.log(data);
    if (data.success) {
      props.udpateAuthStatus(true);
      setAuthStatus();
    } else props.udpateAuthStatus(false);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin}>
        <div className="p-6 flex flex-col gap-2">
          <Typography variant="h5" component="h2" className="mb-4">
            Login
          </Typography>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            className="mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            className="mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}
export function Register() {
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const updateRegisterData = (value: string, field: string) => {
    setRegisterData((v) => {
      return {
        ...v,
        [field]: value,
      };
    });
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={() => {}}>
        <div className="p-6 flex flex-col gap-2">
          <Typography variant="h5" component="h2" className="mb-4">
            Login
          </Typography>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            className="mb-4"
            value={registerData.firstName}
            onChange={(e) => updateRegisterData(e.target.value, 'firstName')}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            className="mb-4"
            value={registerData.lastName}
            onChange={(e) => updateRegisterData(e.target.value, 'lastName')}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            className="mb-4"
            value={registerData.email}
            onChange={(e) => updateRegisterData(e.target.value, 'email')}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            className="mb-4"
            value={registerData.password}
            onChange={(e) => updateRegisterData(e.target.value, 'password')}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}
