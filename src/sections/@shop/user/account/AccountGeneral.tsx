import { useCallback, useMemo } from 'react';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Badge, Box, Card, Grid, Stack, Typography, alpha } from '@mui/material';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// utils
import { getUrlImage } from '../../../../utils/cloudinary';
import { fData } from '../../../../utils/formatNumber';
// components
import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';
import { CustomFile } from '../../../../components/upload';
// api
import { cloudinaryApi } from '../../../../api-client/cloudinary';
import customerApi from '../../../../api-client/customer';

// ----------------------------------------------------------------------

type FormValuesProps = {
  fullName: string;
  email: string;
  imageUrl: CustomFile | string | null;
  phone: string;
};

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { user, update } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({
    fullName: Yup.string().required('Vui lòng nhập tên'),
    // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    // imageUrl: Yup.mixed().required('Avatar is required'),
    // phone: Yup.string().required('Phone number is required'),
  });

  const defaultValues = useMemo(
    () => ({
      fullName: user?.fullName || '',
      email: user?.email || '',
      imageUrl: getUrlImage.avatar(user?.imageUrl) || null,
      phone: user?.phone || '',
    }),
    [user]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    watch,
    // reset,
    formState: { isSubmitting, isValid, isDirty },
  } = methods;

  const values = watch();

  const onSubmit = async (data: FormValuesProps) => {
    try {
      let imageUrl = user?.imageUrl ?? null;
      if (data.imageUrl && typeof data.imageUrl !== 'string') {
        const res = await cloudinaryApi.uploadSign(data.imageUrl, {
          public_id: user?.id,
          folder: 'users',
        });
        imageUrl = `${user?.id}.${res.format}`;
      }

      const res = await customerApi.update({ fullName: data.fullName, imageUrl });
      update(res);

      enqueueSnackbar('Cập nhật tài khoản thành công!');
    } catch (error) {
      enqueueSnackbar('Cập nhật tài khoản thất bại', { variant: 'error' });

      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('imageUrl', newFile, { shouldValidate: true, shouldDirty: true });
      }
    },
    [setValue]
  );

  const handleRemoveAvatar = () => {
    console.log('Click');
    setValue('imageUrl', null, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <Badge
              color="default"
              overlap="circular"
              component="div"
              componentsProps={{ badge: { onClick: handleRemoveAvatar } }}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{
                '& .MuiBadge-badge': {
                  cursor: 'pointer',
                },
              }}
              badgeContent={
                values.imageUrl ? (
                  <Iconify
                    icon="eva:close-fill"
                    width={20}
                    sx={{
                      zIndex: 9999,
                      bgcolor: '#fff',
                      borderRadius: 999,
                      '&:hover': {
                        color: (theme) => theme.palette.primary.main,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.3),
                        borderColor: (theme) => theme.palette.primary.main,
                      },
                      border: '.2px solid #a7b6c3',
                      p: '2px',
                    }}
                  />
                ) : null
              }
            >
              <RHFUploadAvatar
                name="imageUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={() =>
                  setValue('imageUrl', null, { shouldValidate: true, shouldDirty: true })
                }
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Cho phép file *.jpeg, *.jpg, *.png, *.gif
                    <br /> tối đa {fData(3145728)}
                  </Typography>
                }
              />
            </Badge>

            {/* <RHFSwitch
              name="isPublic"
              labelPlacement="start"
              label="Public Profile"
              sx={{ mt: 5 }}
            /> */}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="fullName" label="Họ và tên" />

              <RHFTextField name="email" label="Email" disabled />

              <RHFTextField name="phone" label="Số điện thoại" disabled />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!isValid || !isDirty}
              >
                Lưu thay đổi
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
