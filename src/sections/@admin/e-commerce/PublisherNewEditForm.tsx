import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useMemo, useEffect } from 'react';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Paper, Stack, Typography } from '@mui/material';
// @types
import { IPublisher } from 'src/@types/book';
// api
import publisherApi from 'src/api-client/publisher';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// component
import FormProvider from 'src/components/hook-form/FormProvider';
import { RHFTextField } from 'src/components/hook-form';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 480,
  pt: 2,
  px: 4,
  pb: 3,
};

type Props = {
  isEdit?: boolean;
  publisher?: Partial<IPublisher>;
  onCancel?: () => void;
  onCloseModal?: () => void;
  onSuccess?: (data?: IPublisher) => void;
};

export default function PublisherNewEditForm({
  isEdit,
  publisher,
  onCloseModal,
  onCancel,
  onSuccess,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      name: publisher?.name || '',
      description: publisher?.description || '',
    }),
    [publisher]
  );

  const NewGenreSchema = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập nhà xuất bản'),
  });

  const methods = useForm<IPublisher>({
    resolver: yupResolver(NewGenreSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  useEffect(() => {
    if (isEdit && publisher) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, publisher]);

  const onSubmit = async (data: IPublisher) => {
    try {
      let res;
      if (isEdit) {
        res = await publisherApi.update({ ...data, id: publisher!.id! });
      } else {
        res = await publisherApi.create(data);
      }
      if (onSuccess) await onSuccess(res);
      enqueueSnackbar(`${isEdit ? 'Cập nhật' : 'Thêm mới'} nhà xuất bản thành công.`);
      if (onCloseModal) onCloseModal();
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`${isEdit ? 'Cập nhật' : 'Thêm mới'} nhà xuất bản thất bại.`, {
        variant: 'error',
      });
    }
  };

  return (
    <FormProvider methods={methods}>
      <Paper sx={{ ...style }}>
        <Typography mb={2} sx={{ fontSize: 20, fontWeight: 700 }}>
          {!isEdit ? 'Thêm nhà xuất bản' : 'Cập nhật nhà xuất bản'}
        </Typography>
        <Stack spacing={1}>
          <RHFTextField name="name" label="Tên nhà xuất bản" autoFocus />
          <RHFTextField name="description" label="Mô tả" />
        </Stack>
        <Stack direction="row" mt={2} spacing={2}>
          <Button variant="outlined" sx={{ ml: 'auto' }} onClick={onCancel}>
            Hủy
          </Button>
          <LoadingButton
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid}
          >
            {!isEdit ? 'Thêm mới' : 'Cập nhật'}
          </LoadingButton>
        </Stack>
      </Paper>
    </FormProvider>
  );
}
