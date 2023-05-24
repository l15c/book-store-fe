import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// config
import { useAuthContext } from 'src/auth/useAuthContext';
import { PATH_AFTER_LOGIN } from '../../config-global';
// routes
import { PATH_ADMIN } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function Index() {
  const { user } = useAuthContext();
  const { pathname, replace, prefetch } = useRouter();

  useEffect(() => {
    if (pathname === PATH_ADMIN.root) {
      if (user?.roleId === 4) replace(PATH_ADMIN.invoice.root);
      else replace(PATH_ADMIN.general.ecommerce);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    prefetch(PATH_AFTER_LOGIN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
