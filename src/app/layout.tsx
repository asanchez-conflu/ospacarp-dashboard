import { Inter } from 'next/font/google';
import './globals.css';

import SideNavigation from '@/components/common/SideNavigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body className={`${inter.className} min-h-screen text-black`}>
        <div className='flex flex-col md:flex-row min-h-screen'>
          <SideNavigation />
          <main className='flex-grow p-4 overflow-y-auto bg-gray-100	'>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
