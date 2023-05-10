import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, IconButton, InputAdornment, Stack } from '@mui/material';
// @types
import { IUserAccountChangePassword } from 'src/@types/user';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useState } from 'react';
import customerApi from 'src/api-client/customer';

// ----------------------------------------------------------------------

type FormValuesProps = IUserAccountChangePassword;

export default function AuthChangePasswordForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const ChangePassWordSchema = Yup.object().shape({
    password: Yup.string().required('Vui lòng nhập mật khẩu hiện tại'),
    newPassword: Yup.string()
      .required('Vui lòng nhập mật khẩu mới')
      .min(8, 'Mật khẩu tối thiểu 8 kí tự'),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref('newPassword')],
      'Nhập lại mật khẩu không chính xác'
    ),
  });

  const defaultValues = {
    password: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await customerApi.changePassword(data);
      reset();
      enqueueSnackbar('Cập nhật thành công!');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Cập nhật không thành công!', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ display: 'flex', justifyContent: 'center' }}>
        <Stack spacing={3} alignItems="flex-end" sx={{ p: 3, width: '400px' }}>
          <RHFTextField
            name="password"
            label="Mật khẩu hiện tại"
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
            name="newPassword"
            label="Mật khẩu mới"
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
            helperText={
              <Stack component="span" direction="row" alignItems="center">
                <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Mật khẩu phải tối thiểu
                8 kí tự
              </Stack>
            }
          />

          <RHFTextField
            name="confirmNewPassword"
            label="Nhập lại mật khẩu mới"
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

          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            loading={isSubmitting}
            fullWidth
          >
            Đổi mật khẩu
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
