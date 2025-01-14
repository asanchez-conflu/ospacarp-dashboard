'use client';
import LoginForm from '@/components/login/loginForm';
import React from 'react';
import { useRouter } from 'next/navigation';

const HomePage: React.FC = () => {
  const style = {
    height: '100vh',
    width: '100vw',
    backgroundImage: `url(background.jpeg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  };

  const navigation = useRouter();

  const handleSubmit = (email: string, password: string) => {
    console.log('Email:', email);
    console.log('Password:', password);
    navigation.push('/dashboard');
  };

  return (
    <main
      style={style}
      className='flex flex-col items-center justify-center h-screen'
    >
      <LoginForm onSubmit={handleSubmit} />
    </main>
  );
};

export default HomePage;
