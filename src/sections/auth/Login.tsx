// next
import NextLink from 'next/link';
// @mui
import { Tooltip, Stack, Typography, Link, Box } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import LoginLayout from '../../layouts/login';
// routes
import { PATH_AUTH } from '../../routes/paths';
//
import AuthLoginForm from './AuthLoginForm';
// import AuthWithSocial from './AuthWithSocial';

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuthContext();

  return (
    <LoginLayout title="Chào mừng đến với Book Store">
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Đăng nhập vào Book Store</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">Bạn là người mới?</Typography>

          <Link component={NextLink} href={PATH_AUTH.register} variant="subtitle2">
            Tạo tài khoản ngay
          </Link>
        </Stack>

        <Tooltip title={method} placement="left">
          <Box
            component="img"
            alt={method}
            src={`/assets/icons/auth/ic_${method}.png`}
            sx={{ width: 32, height: 32, position: 'absolute', right: 0 }}
          />
        </Tooltip>
      </Stack>

      <AuthLoginForm customers />

      {/* <AuthWithSocial /> */}
    </LoginLayout>
  );
}
