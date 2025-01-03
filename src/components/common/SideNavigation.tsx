import React from 'react';
import Link from 'next/link';
import {
  MdHome,
  MdTrendingUp,
  MdArrowDownward,
  MdPeople,
} from 'react-icons/md';

const Sidebar = () => {
  return (
    <aside className='p-4 bg-white w-[250px] 2xl:w-[300px]'>
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

      <div className='flex flex-col items-center'>
        <Link
          href='/'
          className='flex items-center w-[190px] px-5 py-2 mb-2 rounded-full bg-blue-600'
        >
          <MdHome className='mr-2' />
          Inicio
        </Link>
        <Link
          href='/ingresos'
          className='flex items-center w-[190px] px-5 py-2 mb-2 rounded-full'
        >
          <MdTrendingUp className='mr-2' />
          Ingresos
        </Link>
        <Link
          href='/egresos'
          className='flex items-center w-[190px] px-5 py-2 mb-2 rounded-full'
        >
          <MdArrowDownward className='mr-2' />
          Egresos
        </Link>
        <Link
          href='/afiliados'
          className='flex items-center w-[190px] px-5 py-2 mb-2 rounded-full'
        >
          <MdPeople className='mr-2' />
          Afiliados
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
