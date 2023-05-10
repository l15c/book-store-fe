// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_SHOP } from 'src/routes/paths';
// layouts
import ShopLayout from 'src/layouts/shop';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import AuthChangePasswordForm from 'src/sections/auth/AuthChangePasswordForm';

// ----------------------------------------------------------------------

UserAccountPage.getLayout = (page: React.ReactElement) => <ShopLayout>{page}</ShopLayout>;

// ----------------------------------------------------------------------

export default function UserAccountPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title>Đổi mật khẩu | Book Store</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          links={[{ name: 'Trang chủ', href: PATH_SHOP.root }, { name: 'Tài khoản' }]}
        />
        <AuthChangePasswordForm />
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
