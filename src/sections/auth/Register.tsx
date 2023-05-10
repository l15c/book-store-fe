// next
import NextLink from 'next/link';
// @mui
import { Stack, Typography, Link } from '@mui/material';
// layouts
import LoginLayout from '../../layouts/login';
// routes
import { PATH_AUTH } from '../../routes/paths';
//
// import AuthWithSocial from './AuthWithSocial';
import AuthRegisterForm from './AuthRegisterForm';

// ----------------------------------------------------------------------

export default function Register() {
  return (
    <LoginLayout title="">
      <Stack spacing={1} sx={{ mb: 3, position: 'relative' }}>
        <Typography variant="h4">Đăng ký tài khoản Book Store</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> Bạn đã có tài khoản?</Typography>

          <Link component={NextLink} href={PATH_AUTH.login} variant="subtitle2">
            Đăng nhập tại đây
          </Link>
        </Stack>
      </Stack>

      <AuthRegisterForm />

      <Typography
        component="div"
        sx={{ color: 'text.secondary', mt: 3, typography: 'caption', textAlign: 'center' }}
      >
        {'Bằng việc đăng ký, Tôi đồng ý '}
        <Link underline="always" color="text.primary">
          Điều khoản dịch vụ
        </Link>
        {' và '}
        <Link underline="always" color="text.primary">
          Chính sách bảo mật
        </Link>
        .
      </Typography>

      {/* <AuthWithSocial /> */}
    </LoginLayout>
  );
}
