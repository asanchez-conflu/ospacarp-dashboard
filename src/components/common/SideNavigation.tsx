'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MdHome,
  MdTrendingUp,
  MdArrowDownward,
  MdPeople,
  MdOutlineLogout,
} from 'react-icons/md';
import { usePathname, useRouter } from 'next/navigation';
import { User } from '@/app/types/dashboard';
import { getInitials } from '@/utils/utils';

const Sidebar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        // Parse the stored JSON string
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const pathname = usePathname();
  const navigation = useRouter();

  const sections = [
    { name: 'Inicio', path: '/dashboard', icon: <MdHome className='mr-2' /> },
    {
      name: 'Ingresos',
      path: '/dashboard/ingresos',
      icon: <MdTrendingUp className='mr-2' />,
    },
    {
      name: 'Egresos',
      path: '/dashboard/egresos',
      icon: <MdArrowDownward className='mr-2' />,
    },
    {
      name: 'Afiliados',
      path: '/dashboard/afiliados',
      icon: <MdPeople className='mr-2' />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigation.push('/');
  };

  return (
    <aside className='fixed top-0 left-0 p-4 bg-white h-screen w-[250px] 2xl:w-[300px] flex flex-col '>
      <div className='flex flex-col h-[120px] items-center m-4'>
        {user && (
          <>
            <div className='w-16 h-16 rounded-full flex items-center justify-center bg-blue-500'>
              <span className='text-2xl font-semibold text-white '>
                {getInitials(user)}
              </span>
            </div>

            <div className='text-center'>
              <h2 className='text-lg font-semibold'>
                {user.UserFirstName} {user.UserLastName}
              </h2>
              <p className='text-sm'>{user.Roles}</p>
            </div>
          </>
        )}
      </div>

      {/* user.UserURLImage && (
            <div>
              <img src={user.UserURLImage}></img>
            </div>
          ) 
      */}

      <hr className='my-4 border-gray-200' />

      <div className='flex-grow flex flex-col items-center font-bold'>
        {sections.map((section) => (
          <Link key={section.path} href={section.path} legacyBehavior>
            <a
              className={`flex items-center w-[190px] px-5 py-2 mb-2 rounded-full 
              ${
                (pathname === section.path ||
                  pathname.startsWith(section.path + '/')) &&
                (section.path !== '/dashboard' || pathname === '/dashboard')
                  ? 'bg-blue-600 text-white'
                  : ''
              }`}
            >
              {section.icon}
              {section.name}
            </a>
          </Link>
        ))}
      </div>

      <hr className='my-4 border-gray-200' />

      <Link
        href='/'
        className='flex items-center w-[190px] px-5 py-2 mb-2 font-bold'
        onClick={(e) => {
          e.preventDefault(); // Prevent default link behavior
          handleLogout();
        }}
      >
        <MdOutlineLogout className='mr-2' />
        Cerrar sesión
      </Link>
    </aside>
  );
};

export default Sidebar;
