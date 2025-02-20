'use client';
import LoginForm from '@/components/login/loginForm';
import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const HomePage: React.FC = () => {
  const endpoint =
    'https://api-prepro.ospatrones.sisaludevo1.com.ar/ospacarpqa/oauth/gam/v2.0/access_token';

  const style = {
    height: '100vh',
    width: '100vw',
    backgroundImage: `url(http://localhost:3000/background.jpeg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  };

  const navigation = useRouter();

  const handleSubmit = async (username: string, password: string) => {
    console.log('Email:', username);
    console.log('Password:', password);

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
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        // Store JWT in local storage (or use a secure cookie library)
        console.log('LOGIN: ', response);
        localStorage.setItem('jwt', response.data.access_token);

        // Redirect to protected page
        navigation.push('/dashboard');
      } else {
        console.log('Error');
        // setError('Login failed');
      }
    } catch (error) {
      console.log('Error: ', error);
      // setError('Invalid username or password');
    }
  };

  return (
    <main style={style} className='flex flex-col items-center justify-center'>
      <div className='max-w-7xl w-full h-screen flex flex-col items-center justify-center'>
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </main>
  );
};

export default HomePage;
