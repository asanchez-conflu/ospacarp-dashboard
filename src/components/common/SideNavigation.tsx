import React from 'react';
import Link from 'next/link';
import {
  MdHome,
  MdTrendingUp,
  MdArrowDownward,
  MdPeople,
  MdOutlineLogout,
} from 'react-icons/md';

const Sidebar = () => {
  return (
    <aside className='fixed top-0 left-0 p-4 bg-white h-screen w-[250px] 2xl:w-[300px] flex flex-col '>
      <div className='flex flex-col items-center mb-4'>
        <div className='w-16 h-16 rounded-full flex items-center justify-center bg-blue-500'>
          <span className='text-2xl font-semibold'>MO</span>
        </div>
        <div className='text-center'>
          <h2 className='text-lg font-semibold'>Milton Olivera</h2>
          <p className='text-sm'>Sistemas</p>
        </div>
      </div>

      <hr className='my-4 border-gray-200' />

      <div className='flex-grow flex flex-col items-center'>
        <Link
          href='/dashboard'
          className='flex items-center w-[190px] px-5 py-2 mb-2 rounded-full'
        >
          <MdHome className='mr-2' />
          Inicio
        </Link>
        <Link
          href='/dashboard/ingresos'
          className='flex items-center w-[190px] px-5 py-2 mb-2 rounded-full'
        >
          <MdTrendingUp className='mr-2' />
          Ingresos
        </Link>
        <Link
          href='/dashboard/egresos'
          className='flex items-center w-[190px] px-5 py-2 mb-2 rounded-full'
        >
          <MdArrowDownward className='mr-2' />
          Egresos
        </Link>
        <Link
          href='/dashboard/afiliados'
          className='flex items-center w-[190px] px-5 py-2 mb-2 rounded-full bg-blue-600'
        >
          <MdPeople className='mr-2' />
          Afiliados
        </Link>
      </div>

      <hr className='my-4 border-gray-200' />

      <Link href='/' className='flex items-center w-[190px] px-5 py-2 mb-2'>
        <MdOutlineLogout className='mr-2' />
        Cerrar sesión
      </Link>
    </aside>
  );
};

export default Sidebar;
