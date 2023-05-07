import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Grid } from '@mui/material';
// @types
import { ICheckoutState } from 'src/@types/book';
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
  // {
  //   value: 'paypal',
  //   title: 'Pay with Paypal',
  //   description: 'You will be redirected to PayPal website to complete your purchase securely.',
  //   icons: ['/assets/icons/payments/ic_paypal.svg'],
  // },
  {
    value: 'momo',
    title: 'Ví Momo',
    description: 'Thanh toán đơn hàng của bạn bằng ví điện tử MoMo.',
    icons: [
      // '/assets/icons/payments/momo_square_pinkbg.svg',
      '/assets/icons/payments/momo_icon_square_pinkbg.svg',
      // '/assets/icons/payments/momo_circle_pinkbg.svg',
    ],
  },
  // {
  //   value: 'credit_card',
  //   title: 'Credit / Debit Card',
  //   description: 'We support Mastercard, Visa, Discover and Stripe.',
  //   icons: ['/assets/icons/payments/ic_mastercard.svg', '/assets/icons/payments/ic_visa.svg'],
  // },
  {
    value: 'cash',
    title: 'Trực tiếp',
    description: 'Thanh toán khi đơn hàng được giao đến bạn.',
    icons: ['/assets/icons/payments/ic_cash.png'],
  },
];

const CARDS_OPTIONS: ICheckoutCardOption[] = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

type Props = {
  checkout: ICheckoutState;
  onNextStep: VoidFunction;
  onBackStep: VoidFunction;
  onReset: VoidFunction;
  onGotoStep: (step: number) => void;
  onApplyShipping: (value: number) => void;
};

type FormValuesProps = {
  delivery: number;
  payment: string;
};

export default function CheckoutPayment({
  checkout,
  onReset,
  onNextStep,
  onBackStep,
  onGotoStep,
  onApplyShipping,
}: Props) {
  const { shipping, billing } = checkout;

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required!'),
  });

  const defaultValues = {
    delivery: shipping,
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

  const onSubmit = async () => {
    try {
      onNextStep();
      onReset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CheckoutPaymentMethods
            cardOptions={CARDS_OPTIONS}
            paymentOptions={PAYMENT_OPTIONS}
            sx={{ mb: 3 }}
          />

          <Button
            size="small"
            color="inherit"
            onClick={onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Back
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
            Complete Order
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
