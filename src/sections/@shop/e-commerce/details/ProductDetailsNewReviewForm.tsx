import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Stack,
  Button,
  Rating,
  Dialog,
  Typography,
  DialogTitle,
  DialogProps,
  DialogActions,
  DialogContent,
  FormHelperText,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import reviewApi from 'src/api-client/review';
// components
import FormProvider, { RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = {
  rating: number | string | null;
  comment: string;
};

interface Props extends DialogProps {
  onClose: VoidFunction;
  bookId: number;
  slug: string;
}

export default function ProductDetailsNewReviewForm({ onClose, slug, bookId, ...other }: Props) {
  const queryClient = useQueryClient();

  const { enqueueSnackbar } = useSnackbar();

  const ReviewSchema = Yup.object().shape({
    rating: Yup.mixed().required('Vui lòng đánh giá sản phẩm'),
    comment: Yup.string().required('Vui lòng viết nhận xét'),
  });

  const defaultValues = {
    rating: null,
    comment: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async ({ rating, comment }: FormValuesProps) => {
    try {
      await reviewApi.create({
        rating: Number(rating),
        comment,
        bookId,
      });
      queryClient.invalidateQueries({
        queryKey: ['products', slug],
        refetchType: 'all',
      });
      enqueueSnackbar('Gửi đánh giá thành công');
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const onCancel = () => {
    onClose();
    reset();
  };

  return (
    <Dialog onClose={onClose} fullWidth maxWidth="sm" {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle> Đánh giá sản phẩm </DialogTitle>

        <DialogContent>
          <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5}>
            <Typography variant="body2">Đánh giá về sản phẩm này:</Typography>

            <Controller
              name="rating"
              control={control}
              render={({ field }) => <Rating {...field} value={Number(field.value)} />}
            />
          </Stack>

          {!!errors.rating && <FormHelperText error> {errors.rating?.message}</FormHelperText>}

          <RHFTextField
            name="comment"
            label="Nhận xét sản phẩm *"
            multiline
            rows={3}
            sx={{ mt: 3 }}
          />
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onCancel}>
            Hủy
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Gửi đánh giá
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
