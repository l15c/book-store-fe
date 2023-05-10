// next
import NextLink from 'next/link';
// @mui
import { Tooltip, Stack, Typography, Link, Box, Alert } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import LoginLayout from '../../layouts/login';
// routes
import { PATH_AUTH } from '../../routes/paths';
import AuthLoginForm from '../auth/AuthLoginForm';

// ----------------------------------------------------------------------

export default function AdminLogin() {
  const { method } = useAuthContext();

  return (
    <LoginLayout title="Book Store Management">
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Đăng nhập vào Book Store</Typography>

        <Tooltip title={method} placement="left">
          <Box
            component="img"
            alt={method}
            src={`/assets/icons/auth/ic_${method}.png`}
            sx={{ width: 32, height: 32, position: 'absolute', right: 0 }}
          />
        </Tooltip>
      </Stack>

      <Alert severity="warning" sx={{ mb: 3 }}>
        Trang này dành cho quản trị viên và nhân viên. <br />
        Khách hàng vui lòng
        <Link component={NextLink} href={PATH_AUTH.login}>
          {' '}
          đăng nhập tại đây.
        </Link>
      </Alert>

      <AuthLoginForm />
    </LoginLayout>
  );
}
