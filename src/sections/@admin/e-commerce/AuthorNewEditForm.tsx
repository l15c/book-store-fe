import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useMemo, useEffect } from 'react';
// @types
import authorApi from 'src/api-client/author';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { IAuthor } from 'src/@types/book';
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
  author?: Partial<IAuthor>;
  onCancel?: () => void;
  onCloseModal?: () => void;
  onSuccess?: (data?: IAuthor) => void;
};

export default function AuthorNewEditForm({
  isEdit,
  author,
  onCloseModal,
  onCancel,
  onSuccess,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      name: author?.name || '',
      description: author?.description || '',
    }),
    [author]
  );

  const NewGenreSchema = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập tác giả'),
  });

  const methods = useForm<IAuthor>({
    resolver: yupResolver(NewGenreSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  useEffect(() => {
    if (isEdit && author) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, author]);

  const onSubmit = async (data: IAuthor) => {
    try {
      let res;
      if (isEdit) {
        res = await authorApi.update({ ...data, id: author!.id! });
      } else {
        res = await authorApi.create(data);
      }
      if (onSuccess) await onSuccess(res);
      enqueueSnackbar(`${isEdit ? 'Cập nhật' : 'Thêm mới'} tác giả thành công.`);
      if (onCloseModal) onCloseModal();
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`${isEdit ? 'Cập nhật' : 'Thêm mới'} tác giả thất bại.`, {
        variant: 'error',
      });
    }
  };

  return (
    <FormProvider methods={methods}>
      <Paper sx={{ ...style }}>
        <Typography mb={2} sx={{ fontSize: 20, fontWeight: 700 }}>
          {!isEdit ? 'Thêm tác giả' : 'Cập nhật tác giả'}
        </Typography>
        <Stack spacing={1}>
          <RHFTextField name="name" label="Tên tác giả" autoFocus />
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
