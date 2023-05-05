import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Paper, Stack, Typography } from '@mui/material';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
//
import { IGenre } from 'src/@types/book';
import genresApi from 'src/api-client/genre';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import { useQueryClient } from '@tanstack/react-query';

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
  genre?: Partial<IGenre>;
  onCancel?: () => void;
  onCloseModal?: () => void;
  onSuccess?: (data?: IGenre) => void;
};

export default function GenreNewEditForm({
  isEdit,
  genre,
  onCancel,
  onCloseModal,
  onSuccess,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const defaultValues = useMemo(
    () => ({
      name: genre?.name || '',
      description: genre?.description || '',
      icon: genre?.icon || '',
    }),
    [genre]
  );

  const NewGenreSchema = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập thể loại'),
  });

  const methods = useForm<IGenre>({
    resolver: yupResolver(NewGenreSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  useEffect(() => {
    if (isEdit && genre) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, genre]);

  const onSubmit = async (data: IGenre) => {
    try {
      let res;
      if (isEdit) {
        res = await genresApi.update({ ...data, id: genre!.id! });
      } else {
        res = await genresApi.create(data);
      }
      queryClient.invalidateQueries({
        queryKey: ['genre', 'all'],
      });

      if (onSuccess) await onSuccess(res);

      enqueueSnackbar(`${isEdit ? 'Cập nhật' : 'Thêm mới'} thể loại thành công.`);
      if (onCloseModal) onCloseModal();
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`${isEdit ? 'Cập nhật' : 'Thêm mới'} thể loại thất bại.`, {
        variant: 'error',
      });
    }
  };

  return (
    <FormProvider methods={methods}>
      <Paper sx={{ ...style }}>
        <Typography mb={2} sx={{ fontSize: 20, fontWeight: 700 }}>
          {!isEdit ? 'Thêm thể loại' : 'Cập nhật thể loại'}
        </Typography>
        <Stack spacing={1}>
          <RHFTextField name="name" label="Tên thể loại" autoFocus />
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
