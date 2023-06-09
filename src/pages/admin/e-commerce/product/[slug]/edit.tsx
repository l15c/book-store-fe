import { useQuery } from '@tanstack/react-query';
// import { useEffect } from 'react';
// import { paramCase } from 'change-case';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// redux
// import { useDispatch } from 'src/redux/store';
// layouts
import AdminLayout from 'src/layouts/admin';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import RoleBasedGuard from 'src/auth/RoleBasedGuard';
// // sections
import { ProductNewEditForm } from 'src/sections/@admin/e-commerce';
// components
import { useSettingsContext } from 'src/components/settings';
import { useData } from '../../../../../hooks/data';
import bookApi from '../../../../../api-client/book';
import { PATH_ADMIN } from '../../../../../routes/paths';
import { LoadingLinear } from '../../../../../components/loading-screen/LoadingScreen';

// ----------------------------------------------------------------------

EcommerceProductEditPage.getLayout = (page: React.ReactElement) => (
  <AdminLayout>
    <RoleBasedGuard hasContent roles={[1, 2, 3, 5]}>
      {page}
    </RoleBasedGuard>
  </AdminLayout>
);

// ----------------------------------------------------------------------

export default function EcommerceProductEditPage() {
  const { themeStretch } = useSettingsContext();

  const { query } = useRouter();
  const slug = (query?.slug as string) ?? '';

  const {
    query: { queries },
  } = useData(!!slug);

  const { data, isFetching } = useQuery({
    queryKey: ['products', slug],
    queryFn: () => bookApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

  const loading = queries.some((q) => q.isFetching) || isFetching;

  return (
    <>
      <Head>
        <title> Cập nhật sản phẩm | Book Store</title>
      </Head>

      <Container
        maxWidth={themeStretch ? false : 'lg'}
        sx={{ maxHeight: '100vdh', overflow: 'hidden' }}
      >
        {loading && <LoadingLinear />}
        <CustomBreadcrumbs
          heading="Cập nhật"
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            {
              name: 'Danh sách sản phẩm',
              href: PATH_ADMIN.eCommerce.root,
            },
            { name: data?.name },
          ]}
        />

        <ProductNewEditForm isEdit currentProduct={data} />
      </Container>
    </>
  );
}
