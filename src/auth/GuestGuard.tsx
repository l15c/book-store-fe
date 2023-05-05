import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// routes
import { PATH_ADMIN, PATH_SHOP } from '../routes/paths';
// components
import LoadingScreen from '../components/loading-screen';
//
import { useAuthContext } from './useAuthContext';
import { USER_ROLE_ID } from '../api-client/customer';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: React.ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { push, asPath, pathname } = useRouter();

  const { user, isAuthenticated, isInitialized } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated) {
      if (user && user?.roleId !== USER_ROLE_ID) push(PATH_ADMIN.root);
      else push(asPath !== pathname ? asPath : PATH_SHOP.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (isInitialized === isAuthenticated) {
    return <LoadingScreen />;
  }

  return <> {children} </>;
}
