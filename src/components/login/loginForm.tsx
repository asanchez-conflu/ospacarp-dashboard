'use client';
import React, { useState } from 'react';

interface LoginProps {
  onSubmit: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(username, password);
  };

  return (
    <div className='bg-white rounded w-fit p-5'>
      <form onSubmit={handleSubmit} className='flex flex-col items-center'>
        <h2 className='text-2xl font-bold mb-4'>Inicio de Sesión</h2>

        <div className='mb-4'>
          <label
            htmlFor='username'
            className='block text-sm font-medium text-gray-700'
          >
            username Empresarial
          </label>
          <input
            type='text'
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        <div className='mb-4'>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Contraseña
          </label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        <div className='flex space-x-4'>
          <button
            type='button'
            className='bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md'
          >
            Cancelar
          </button>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md'
          >
            Aceptar
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
