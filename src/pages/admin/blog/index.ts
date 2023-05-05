import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// routes
import { PATH_ADMIN } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function Index() {
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (pathname === PATH_ADMIN.blog.root) {
      push(PATH_ADMIN.blog.posts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
