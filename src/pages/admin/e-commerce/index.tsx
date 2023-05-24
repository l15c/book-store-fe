import { useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// layout
import AdminLayout from 'src/layouts/admin/AdminLayout';
// routes
import { PATH_ADMIN } from 'src/routes/paths';
import RoleBasedGuard from 'src/auth/RoleBasedGuard';

// ----------------------------------------------------------------------
EcommerceIndex.getLayout = (page: React.ReactElement) => (
  <AdminLayout>
    <RoleBasedGuard hasContent roles={[1, 2, 3, 5]}>
      {page}
    </RoleBasedGuard>
  </AdminLayout>
);

export default function EcommerceIndex() {
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (pathname === PATH_ADMIN.eCommerce.root) {
      push(PATH_ADMIN.eCommerce.list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
