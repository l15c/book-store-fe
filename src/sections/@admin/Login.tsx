// next
import NextLink from 'next/link';
// @mui
import { Stack, Typography, Link, Alert } from '@mui/material';
// layouts
import LoginLayout from '../../layouts/login';
// routes
import { PATH_AUTH } from '../../routes/paths';
import AuthLoginForm from '../auth/AuthLoginForm';

// ----------------------------------------------------------------------

export default function AdminLogin() {
  return (
    <LoginLayout title="Book Store Management">
      <Stack spacing={2} sx={{ mb: 4, position: 'relative', alignItems: 'center' }}>
        <Typography variant="h4">Đăng nhập vào Book Store</Typography>
      </Stack>

      <Alert severity="warning" sx={{ mb: 3, alignItems: 'center' }}>
        Trang quản trị viên và nhân viên. <br />
        Khách hàng vui lòng
        <Link component={NextLink} href={PATH_AUTH.login}>
          &nbsp;đăng nhập tại đây.
        </Link>
      </Alert>

      <AuthLoginForm />
    </LoginLayout>
  );
}
