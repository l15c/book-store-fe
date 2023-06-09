import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import * as Yup from 'yup';
import NextLink from 'next/link';
import { syncCart } from 'src/redux/slices/cart';
import { useDispatch, useSelector } from 'src/redux/store';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PATH_AUTH } from 'src/routes/paths';
// @mui
import { Stack, Alert, IconButton, InputAdornment, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// ro
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
// utils
import { PHONE_REG_EXP } from '../../utils/regex';

// ----------------------------------------------------------------------
type Props = {
  customers?: boolean;
};

type FormValuesProps = {
  phone: string;
  password: string;
  afterSubmit?: string;
};

export default function AuthLoginForm({ customers = false }: Props) {
  const { login } = useAuthContext();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.products);
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    phone: Yup.string()
      .required('Vui lòng nhập số điện thoại')
      .matches(PHONE_REG_EXP, 'Số điện thoại không hợp lệ'),
    password: Yup.string().required('Vui lòng nhập mật khẩu'),
  });

  const defaultValues = {
    phone: '',
    password: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await login(data.phone, data.password, customers);
      queryClient.invalidateQueries({
        queryKey: ['user'],
        refetchType: 'all',
      });
    } catch (error) {
      console.log(error);
      reset();
      if (error.status === 400) {
        setError('afterSubmit', {
          message: 'Tài khoản hoặc mật khẩu không chính xác',
          ...error,
        });
      } else {
        setError('afterSubmit', {
          message: 'Đã xảy ra lỗi. Vui lòng thử lại',
          ...error,
        });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} mb={2}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="phone" label="Số điện thoại" />

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
      </Stack>
      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link
          component={NextLink}
          href={PATH_AUTH.resetPassword}
          variant="body2"
          color="inherit"
          underline="always"
        >
          Quên mật khẩu?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
      >
        Đăng nhập
      </LoadingButton>
    </FormProvider>
  );
}
