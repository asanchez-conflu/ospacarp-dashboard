'use client';
import LoginForm from '@/components/login/loginForm';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getUserData, loginEndpoints } from '@/components/api-client';

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const style = {
    height: '100vh',
    width: '100vw',
    backgroundImage: `url(/background.jpeg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  };

  const navigation = useRouter();

  const handleSubmit = async (username: string, password: string) => {
    console.log('Email:', username);
    console.log('Password:', password);

    if (loading) {
      return;
    }

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append(
      'client_secret',
      'LdW5ykUkkWrDs7D7Z50yooyuaGajaE5XjYChW95y'
    );
    formData.append('client_id', '66J90QoeBnkotQdzDeUiQYXz18l0QAyFZHlBvuk0');
    formData.append('scope', 'fullcontrol');
    formData.append('grant_type', 'Password');

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(loginEndpoints.login, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        localStorage.setItem('jwt', response.data.access_token);

        const userData = await getUserData(response.data.user_guid);
        localStorage.setItem('user', JSON.stringify(userData));

        navigation.push('/dashboard');
      } else {
        console.log('Error');
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      console.log('Error: ', error);
      setError('Error de login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={style} className='flex flex-col items-center justify-center'>
      <div className='max-w-7xl w-full h-screen flex flex-col items-center justify-center'>
        <LoginForm onSubmit={handleSubmit} error={error} />
      </div>
    </main>
  );
};

export default HomePage;
