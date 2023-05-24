import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// routes
import { PATH_ADMIN } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, replace, prefetch } = useRouter();

  useEffect(() => {
    if (pathname === PATH_ADMIN.root) {
      replace(PATH_ADMIN.invoice.root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    prefetch(PATH_ADMIN.general.ecommerce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
