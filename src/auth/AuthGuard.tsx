import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// components
import LoadingScreen from '../components/loading-screen';
//
import Login from '../pages/auth/login';
import { useAuthContext } from './useAuthContext';
import AdminLogin from '../pages/admin/login';
import { USER_ROLE_ID } from '../api-client/customer';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  admin?: boolean;
  children: React.ReactNode;
};

export default function AuthGuard({ admin, children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized, user } = useAuthContext();

  const { pathname, push } = useRouter();

  const [requestedLocation, setRequestedLocation] = useState<string | null>(null);

  useEffect(() => {
    if (requestedLocation && pathname !== requestedLocation) {
      push(requestedLocation);
    }
    if (isAuthenticated) {
      setRequestedLocation(null);
    }
  }, [isAuthenticated, pathname, push, requestedLocation]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    if (admin) return <AdminLogin />;
    return <Login />;
  }

  if (admin && user?.roleId === USER_ROLE_ID) {
    push('/');
    return <LoadingScreen />;
  }

  return <> {children} </>;
}
