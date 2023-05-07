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
import { useQueryClient } from '@tanstack/react-query';
import { useData } from 'src/hooks/data';

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
  publisher?: Partial<IPublisher> | null;
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
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const {
    query: { publisherQuery },
  } = useData();

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
    setError,
    formState: { isSubmitting, isValid, isDirty },
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
      if (!isEdit && publisherQuery.data?.map((e) => e.name).includes(data.name.trim()))
        throw Error('duplicate');
      let res;
      if (isEdit) {
        res = await publisherApi.update({ ...data, id: publisher!.id! });
      } else {
        res = await publisherApi.create(data);
      }
      await queryClient.invalidateQueries({
        queryKey: ['publisher', 'all'],
        refetchType: 'all',
      });

      if (onSuccess) await onSuccess(res);

      enqueueSnackbar(`${isEdit ? 'Cập nhật' : 'Thêm mới'} nhà xuất bản thành công.`);
      if (onCloseModal) onCloseModal();
    } catch (err) {
      console.log(err);
      if (err.message === 'duplicate')
        setError('name', {
          message: 'Tên tác giả đã tồn tại',
        });
      else
        enqueueSnackbar(`${isEdit ? 'Cập nhật' : 'Thêm mới'} nhà xuất bản thất bại.`, {
          variant: 'error',
        });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Paper sx={{ ...style }}>
        <Typography mb={2} sx={{ fontSize: 20, fontWeight: 700 }}>
          {!isEdit ? 'Thêm nhà xuất bản' : 'Cập nhật nhà xuất bản'}
        </Typography>
        <Stack spacing={1}>
          <RHFTextField name="name" label="Tên nhà xuất bản" autoFocus />
          <RHFTextField name="description" label="Mô tả" multiline />
        </Stack>
        <Stack direction="row" mt={2} spacing={2}>
          <Button variant="outlined" sx={{ ml: 'auto' }} onClick={onCancel}>
            Hủy
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid || (isEdit && !isDirty)}
          >
            {!isEdit ? 'Thêm mới' : 'Cập nhật'}
          </LoadingButton>
        </Stack>
      </Paper>
    </FormProvider>
  );
}
