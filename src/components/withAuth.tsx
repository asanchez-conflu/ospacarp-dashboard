'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent: React.FC = (props) => {
    useEffect(() => {
      const accessToken = localStorage.getItem('jwt');

      if (!accessToken) {
        return redirect('/');
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
