import { ReactNode } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const LoginLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body className={`${inter.className} min-h-screen text-black`}>
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
          {children}
        </div>
      </body>
    </html>
  );
};

export default LoginLayout;
