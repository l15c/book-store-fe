import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// next
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
// routes
// components
import FormProvider, { RHFTextField } from '../../components/hook-form';
import customerApi from '../../api-client/customer';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
};

export default function AuthResetPasswordForm() {
  const { enqueueSnackbar } = useSnackbar();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Vui lòng nhập email').email('Email không đúng định dạng'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await customerApi.resetPassword(data.email);
      enqueueSnackbar('Thông tin khôi phục mật khẩu đã được gửi. \nVui lòng kiểm tra email.');
      sessionStorage.setItem('email-recovery', data.email);
    } catch (error) {
      console.error(error);
      if (error?.detail) enqueueSnackbar(error?.detail, { variant: 'error' });
      else enqueueSnackbar('Đã xảy ra lỗi. Vui lòng thử lại.', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField name="email" label="Email khôi phục" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 3 }}
      >
        Gửi yêu cầu
      </LoadingButton>
    </FormProvider>
  );
}
