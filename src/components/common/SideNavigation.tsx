import React from 'react';
import Link from 'next/link';

interface NavigationItemProps {
  href: string;
  label: string;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ href, label }) => {
  return (
    <li className='py-2'>
      <Link href={href} className='block text-gray-700 hover:text-blue-500'>
        {label}
      </Link>
    </li>
  );
};

const SideNavigation: React.FC = () => {
  return (
    <aside className='h-screen'>
      <nav className='h-full flex flex-col bg-black border-r shadow-sm'>
        <div className='p-4 pb-2 flex justify-between items-center'>
          <h2 className='text-lg font-semibold mb-4'>Navigation</h2>
          <ul>
            <NavigationItem href='/' label='Home' />
            <NavigationItem href='/about' label='About' />
            <NavigationItem href='/products' label='Products' />
            <NavigationItem href='/contact' label='Contact' />
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default SideNavigation;
