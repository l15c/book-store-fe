import * as Yup from 'yup';
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
      // await new Promise((resolve) => setTimeout(resolve, 500));
      // sessionStorage.setItem('email-recovery', data.email);
      // push(PATH_AUTH.newPassword);
    } catch (error) {
      console.error(error);
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
