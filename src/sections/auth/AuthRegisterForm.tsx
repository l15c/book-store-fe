import { useState } from 'react';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
// utils
import { PHONE_REG_EXP } from '../../utils/regex';

// ----------------------------------------------------------------------

type FormValuesProps = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  afterSubmit?: string;
};

export default function AuthRegisterForm() {
  const { register } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string().required('Vui lòng nhập tên của bạn'),
    phone: Yup.string()
      .required('Vui lòng nhập số điện thoại')
      .matches(PHONE_REG_EXP, 'Số điện thoại không hợp lệ'),
    email: Yup.string().email('Email không đúng định dạng').required('Vui lòng nhập email'),
    password: Yup.string().min(8, 'Mật khẩu tối thiểu 8 kí tự').required('Vui lòng nhập mật khẩu'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Nhập lại mật khẩu không chính xác'),
  });

  const defaultValues = {
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    // reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const { email, phone, fullName, password } = data;
    try {
      if (register) {
        await register({ email, phone, fullName, password });
        enqueueSnackbar('Đăng ký thành công');
      }
    } catch (error) {
      console.error(error);
      const { status } = error;

      if (status === 400) {
        setError('afterSubmit', {
          ...error,
          message: 'Số điện thoại hoặc email đã đăng ký', // error.message || error
        });
      } else {
        setError('afterSubmit', {
          ...error,
          message: 'Đã xảy ra lỗi. Vui lòng thử lại', // error.message || error
        });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2.5, sm: 2 }}>
          <RHFTextField name="fullName" label="Họ và tên" />
          <RHFTextField name="phone" label="Số điện thoại" />
        </Stack>

        <RHFTextField name="email" label="Email" />

        <RHFTextField
          name="password"
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="confirmPassword"
          label="Nhập lại mật khẩu"
          type={showRePassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowRePassword(!showRePassword)} edge="end">
                  <Iconify icon={showRePassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting || isSubmitSuccessful}
          sx={{
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            '&:hover': {
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            },
          }}
        >
          Tạo tài khoản
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
