import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// layout
import AdminLayout from 'src/layouts/admin/AdminLayout';
// routes
import { PATH_ADMIN } from 'src/routes/paths';

// ----------------------------------------------------------------------
EcommerceIndex.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;

export default function EcommerceIndex() {
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (pathname === `${PATH_ADMIN.eCommerce.root}/product`) {
      push(PATH_ADMIN.eCommerce.list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
