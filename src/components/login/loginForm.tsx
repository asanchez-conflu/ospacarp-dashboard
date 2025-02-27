'use client';
import React, { useState } from 'react';
import { MdFavorite } from 'react-icons/md';

interface LoginProps {
  onSubmit: (username: string, password: string) => void;
  error: string | null;
}

const LoginForm: React.FC<LoginProps> = ({ onSubmit, error = null }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(username, password);
  };

  return (
    <div className='bg-white rounded-lg w-[348px] h-[450px] p-5'>
      <form
        onSubmit={handleSubmit}
        className='h-full flex flex-col items-center'
      >
        <div className='pb-2'>
          <MdFavorite size={30} color='#56CFE1' />
        </div>
        <h2 className='text-l font-bold mb-4'>Inicio de Sesión</h2>

        <div className='mb-4 w-full'>
          <input
            type='text'
            id='username'
            value={username}
            placeholder='Email Empresarial'
            onChange={(e) => setUsername(e.target.value)}
            className='mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        <div className='mb-4 grow w-full'>
          <input
            type='password'
            id='password'
            value={password}
            placeholder='Contraseña'
            onChange={(e) => setPassword(e.target.value)}
            className='mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500'
          />
          {error && (
            <div className='text-center mt-3 text-red-600'>{error}</div>
          )}
        </div>

        {/* Oculto hasta desarrollo
          <div>
            <button
              type='button'
              className='bg-transparent text-gray-700 font-medium py-5'
            >
              <u>Recuperar contraseña</u>
            </button>
          </div>
        */}

        <div className='flex space-x-4 pt-2 w-full'>
          <button
            type='button'
            className='border border-[#56CFE1] bg-[#56CFE1]/10 text-[#56CFE1] font-medium py-2 px-4 w-full rounded-full'
          >
            Cancelar
          </button>
          <button
            type='submit'
            className='bg-[#56CFE1] text-white font-medium py-2 px-4 w-full rounded-full'
          >
            Aceptar
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
