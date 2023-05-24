import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useMemo, useEffect } from 'react';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
// @types
import { IPublisher } from 'src/@types/book';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// component
import FormProvider from 'src/components/hook-form/FormProvider';
import { RHFTextField } from 'src/components/hook-form';
import { useData } from 'src/hooks/data';
import { IFlashSale } from 'src/@types/flash-sale';
import RHFDatePicker from 'src/components/hook-form/RHFDatePicker';
import RHFDatetimePicker from 'src/components/hook-form/RHFDatetimePicker';
import moment from 'moment';

type Props = {
  open: boolean;
  onClose: () => void;
  sale: IFlashSale | null;
  onCancel?: () => void;
  onSuccess?: (data?: IFlashSale) => void;
};

type FormProps = Omit<IFlashSale, 'startDate' | 'endDate'> & {
  startDate: Date | null;
  endDate: Date | null;
  quantity: number;
  discount: number;
};

export default function FlashSaleNewEditForm({ open, onClose, sale, onCancel, onSuccess }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    query: { publisherQuery },
  } = useData();

  const defaultValues = useMemo(
    () => ({
      name: sale?.name || '',
      description: sale?.description || '',
      startDate: sale?.startDate ? new Date(sale?.startDate) : undefined,
      endDate: sale?.endDate ? new Date(sale?.endDate) : undefined,
    }),
    [sale]
  );

  const NewGenreSchema = Yup.object().shape({
    name: Yup.string().required('Vui lòng nhập tên đợt flashsale'),
    startDate: Yup.date()
      .required('Vui lòng chọn thời gian bắt đầu')
      .typeError('Thời gian không chính xác'),
    endDate: Yup.date()
      .required('Vui lòng chọn thời gian kết thúc')
      .typeError('Thời gian không chính xác'),
  });

  const methods = useForm<FormProps>({
    resolver: yupResolver(NewGenreSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setError,
    watch,
    formState: { isSubmitting, isValid, isDirty },
  } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sale]);

  useEffect(() => {
    if (values.startDate && values.endDate) {
      if (moment(values.startDate).isSameOrAfter(values.endDate))
        setError('endDate', {
          message: 'Thời gian kết thúc phải lớn hơn bắt đầu',
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const onSubmit = async (data: FormProps) => {
    try {
      enqueueSnackbar(`${sale ? 'Cập nhật' : 'Thêm mới'} flashsale thành công.`);
      onClose();
    } catch (err) {
      console.log(err);
      enqueueSnackbar(`${sale ? 'Cập nhật' : 'Thêm mới'} flashsale thất bại.`, {
        variant: 'error',
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Dialog open={open} onClose={onClose} maxWidth="md">
        <DialogTitle sx={{ p: 2 }}>{!sale ? 'Tạo Flashsale' : 'Cập nhật Flashsale'}</DialogTitle>
        <DialogContent
          dividers
          sx={{ py: 2, borderTop: (theme) => `1px solid ${theme.palette.divider}` }}
        >
          <Stack spacing={1}>
            <Stack direction="row" spacing={1}>
              <RHFTextField name="name" label="Tên đợt flashsale" />
              <RHFDatetimePicker name="startDate" label="Bắt đầu" />
              <RHFDatetimePicker name="endDate" label="Kết thúc" />
            </Stack>
            <RHFTextField name="description" label="Ghi chú" multiline />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: '16px !important' }}>
          <Button variant="outlined" color="inherit" sx={{ ml: 'auto' }} onClick={onCancel}>
            Hủy
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!isValid || (!!sale && !isDirty)}
          >
            {!sale ? 'Thêm mới' : 'Cập nhật'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
