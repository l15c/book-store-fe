import { useEffect, useState } from 'react';
import * as Yup from 'yup';
// next
import { useRouter } from 'next/router';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { IconButton, InputAdornment, Stack } from '@mui/material';
import customerApi from 'src/api-client/customer';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import FormProvider, { RHFTextField } from '../../components/hook-form';
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';

// ----------------------------------------------------------------------

type FormValuesProps = {
  // code1: string;
  // code2: string;
  // code3: string;
  // code4: string;
  // code5: string;
  // code6: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function AuthNewPasswordForm() {
  const { push, query } = useRouter();
  const token = (query?.token as string) ?? '';
  const email = (query?.email as string) ?? '';
  console.log(email);
  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  // const emailRecovery =
  //   typeof window !== 'undefined' ? sessionStorage.getItem('email-recovery') : '';

  const VerifyCodeSchema = Yup.object().shape({
    // code1: Yup.string().required('Code is required'),
    // code2: Yup.string().required('Code is required'),
    // code3: Yup.string().required('Code is required'),
    // code4: Yup.string().required('Code is required'),
    // code5: Yup.string().required('Code is required'),
    // code6: Yup.string().required('Code is required'),
    email: Yup.string().required('Vui lòng nhập email').email('Email không đúng định dạng'),
    password: Yup.string().min(8, 'Mật khẩu tối thiểu 8 kí tự').required('Vui lòng nhập mật khẩu'),
    confirmPassword: Yup.string()
      .required('Vui lòng nhập mật khẩu')
      .oneOf([Yup.ref('password')], 'Nhập lại mật khẩu không chính xác'),
  });

  const defaultValues = {
    // code1: '',
    // code2: '',
    // code3: '',
    // code4: '',
    // code5: '',
    // code6: '',
    email: email || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  useEffect(() => {
    if (email) reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await customerApi.confirmResetPassword({ token, ...data });

      // sessionStorage.removeItem('email-recovery');

      enqueueSnackbar('Khôi phục mật khẩu thành công!');

      push(PATH_AUTH.login);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Khôi phục mật khẩu không thành công.\nVui lòng gửi lại yêu cầu', {
        variant: 'error',
      });
      push(PATH_AUTH.resetPassword);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email khôi phục" InputLabelProps={{ shrink: true }} />
        {/* 
        <RHFCodes keyName="code" inputs={['code1', 'code2', 'code3', 'code4', 'code5', 'code6']} /> */}

        {/* {(!!errors.code1 ||
          !!errors.code2 ||
          !!errors.code3 ||
          !!errors.code4 ||
          !!errors.code5 ||
          !!errors.code6) && (
          <FormHelperText error sx={{ px: 2 }}>
            Code is required
          </FormHelperText>
        )} */}

        <RHFTextField
          name="password"
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
        />

        <RHFTextField
          name="confirmPassword"
          label="Nhập lại mật khẩu"
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
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ mt: 3 }}
        >
          Khôi phục mật khẩu
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
