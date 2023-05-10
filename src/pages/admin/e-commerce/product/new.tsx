// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_ADMIN } from 'src/routes/paths';
// layouts
import AdminLayout from 'src/layouts/admin';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// sections
import { ProductNewEditForm } from 'src/sections/@admin/e-commerce';

// ----------------------------------------------------------------------

EcommerceProductCreatePage.getLayout = (page: React.ReactElement) => (
  <AdminLayout>{page}</AdminLayout>
);

// ----------------------------------------------------------------------

export default function EcommerceProductCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> Thêm sản phẩm | Book Store</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Thêm sản phẩm"
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            {
              name: 'Danh sách sản phẩm',
              href: PATH_ADMIN.eCommerce.list,
            },
            { name: 'Thêm mới' },
          ]}
        />
        <ProductNewEditForm />
      </Container>
    </>
  );
}
