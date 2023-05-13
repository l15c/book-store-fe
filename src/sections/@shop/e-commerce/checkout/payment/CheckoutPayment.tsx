import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import compact from 'lodash/compact';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import intersectionWith from 'lodash/intersectionWith';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// api
import orderApi from 'src/api-client/order';
import { useDispatch, useSelector } from 'src/redux/store';
import { syncCart } from 'src/redux/slices/cart';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Grid } from '@mui/material';
// @types
import { PayType } from 'src/@types/order';
import { ICheckoutCardOption, ICheckoutPaymentOption } from '../../../../../@types/product';
// components
import FormProvider from '../../../../../components/hook-form';
import Iconify from '../../../../../components/iconify';
//
import CheckoutSummary from '../CheckoutSummary';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS: ICheckoutPaymentOption[] = [
  {
    value: 'cash',
    title: 'Trực tiếp',
    description: 'Thanh toán khi đơn hàng được giao đến bạn.',
    icons: ['/assets/icons/payments/ic_cash.png'],
  },
  {
    value: 'captureWallet',
    title: 'Ví Momo',
    description: 'Thanh toán đơn hàng của bạn bằng ví điện tử MoMo.',
    icons: [
      '/assets/icons/payments/momo_icon_square_pinkbg.svg',
      // '/assets/icons/payments/momo_square_pinkbg.svg',
      // '/assets/icons/payments/momo_circle_pinkbg.svg',
    ],
  },

  {
    value: 'payWithATM',
    title: 'Thẻ ATM nội địa',
    description: 'Thanh toán qua thẻ ATM các ngân hàng trong nước.',
    icons: ['/assets/icons/payments/logo_napas.png'],
  },
  {
    value: 'payWithCC',
    title: 'Thẻ quốc tế',
    description: 'Hỗ trợ thẻ thanh toán quốc tế Mastercard, Visa, JCB.',
    icons: ['/assets/icons/payments/ic_mastercard.svg', '/assets/icons/payments/ic_visa.svg'],
  },
];

const CARDS_OPTIONS: ICheckoutCardOption[] = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

type Props = {
  onNextStep: VoidFunction;
  onBackStep: VoidFunction;
  onReset: VoidFunction;
  onGotoStep: (step: number) => void;
};

type FormValuesProps = {
  // delivery: number;
  payment: PayType | '';
};

export default function CheckoutPayment({ onReset, onNextStep, onBackStep, onGotoStep }: Props) {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { billing, shipping } = useSelector((state) => state.checkout);
  const { products, selected } = useSelector((state) => state.cart);

  const productsSelected = intersectionWith(products, selected, (p, id) => p.id === id);

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Vui lòng chọn phương thức thanh toán'),
  });

  const defaultValues: FormValuesProps = {
    // delivery: shipping,
    payment: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (productsSelected.some((e) => !e.cartId)) await dispatch(syncCart(products));

      console.log(productsSelected);

      const res = await orderApi.create({
        voucherId: 0,
        checkedCartId: compact(productsSelected.map((e) => e.cartId)),
        deliveryFee: shipping,
        payType: data.payment as PayType,
        shipNote: 'abc',
        userAddressId: billing!.id,
      });

      queryClient.invalidateQueries({
        queryKey: ['user', 'orders'],
        refetchType: 'all',
      });

      onNextStep();
      if (data.payment !== 'cash') push(res as string);

      enqueueSnackbar('Tạo đơn hàng thành công');
      onReset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Tạo đơn hàng không thành công', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            paymentOptions={PAYMENT_OPTIONS}
            sx={{ mb: 2 }}
          />

          <Button
            color="inherit"
            onClick={onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            sx={{ px: 2 }}
          >
            Chọn lại địa chỉ
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutBillingInfo onBackStep={onBackStep} billing={billing} />

          <CheckoutSummary enableEdit onEdit={() => onGotoStep(0)} />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Tạo đơn hàng
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
