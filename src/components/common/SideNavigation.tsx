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
    <aside className='p-4 bg-white'>
      <div className='flex flex-col items-center mb-4'>
        <div className='w-16 h-16 rounded-full flex items-center justify-center mr-4 bg-blue-500'>
          <span className='text-2xl font-semibold'>MO</span>
        </div>
        <div>
          <h2 className='text-lg font-semibold'>Milton Olivera</h2>
          <p className='text-sm'>Sistemas</p>
        </div>
      </div>

      <Link href='/' className='flex items-center w-full py-2 mb-2 rounded-md'>
        <MdHome className='mr-2' />
        Inicio
      </Link>
      <Link
        href='/ingresos'
        className='flex items-center w-full py-2 mb-2 rounded-md'
      >
        <MdTrendingUp className='mr-2' />
        Ingresos
      </Link>
      <Link
        href='/egresos'
        className='flex items-center w-full py-2 mb-2 rounded-md'
      >
        <MdArrowDownward className='mr-2' />
        Egresos
      </Link>
      <Link
        href='/afiliados'
        className='flex items-center w-full py-2 mb-2 rounded-md'
      >
        <MdPeople className='mr-2' />
        Afiliados
      </Link>
    </aside>
  );
};

export default Sidebar;
