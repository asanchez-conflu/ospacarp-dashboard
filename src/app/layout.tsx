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
        <div className='max-w-screen-2xl mx-auto'>
          <div className='flex flex-row min-h-screen'>
            <SideNavigation />
            <main className='ml-[250px] 2xl:ml-[300px] flex-grow p-4 overflow-y-auto bg-gray-100  '>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
