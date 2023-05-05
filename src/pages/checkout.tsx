import { useEffect } from 'react';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Grid, Container } from '@mui/material';
// routes
import { PATH_SHOP } from 'src/routes/paths';
// layouts
import ShopLayout from 'src/layouts/shop/ShopLayout';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import {
  resetCart,
  getCart,
  deleteCart,
  increaseQuantity,
  decreaseQuantity,
} from 'src/redux/slices/cart';
import {
  nextStep,
  backStep,
  gotoStep,
  createBilling,
  applyShipping,
  applyDiscount,
} from 'src/redux/slices/checkout';
// @types
import { ICheckoutBillingAddress } from 'src/@types/product';
// components
import { useSettingsContext } from 'src/components/settings';
// sections
import {
  CheckoutCart,
  CheckoutSteps,
  CheckoutPayment,
  CheckoutOrderComplete,
  CheckoutBillingAddress,
} from 'src/sections/@shop/e-commerce/checkout';

// ----------------------------------------------------------------------

const STEPS = ['Giỏ hàng', 'Địa chỉ', 'Thanh toán'];

// ----------------------------------------------------------------------

EcommerceCheckoutPage.getLayout = (page: React.ReactElement) => <ShopLayout>{page}</ShopLayout>;

// ----------------------------------------------------------------------

export default function EcommerceCheckoutPage() {
  const { replace } = useRouter();

  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const checkout = useSelector((state) => state.checkout);
  const { products } = cart;
  const { billing, activeStep } = checkout;

  const completed = activeStep === STEPS.length;

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch, products]);

  useEffect(() => {
    if (activeStep === 1) {
      dispatch(createBilling(null));
    }
  }, [dispatch, activeStep]);

  const handleNextStep = () => {
    dispatch(nextStep());
  };

  const handleBackStep = () => {
    dispatch(backStep());
  };

  const handleGotoStep = (step: number) => {
    dispatch(gotoStep(step));
  };

  const handleApplyDiscount = (value: number) => {
    if (products.length) {
      dispatch(applyDiscount(value));
    }
  };

  const handleDeleteCart = (productId: number) => {
    dispatch(deleteCart(productId));
  };

  const handleIncreaseQuantity = (productId: number) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId: number) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleCreateBilling = (address: ICheckoutBillingAddress) => {
    dispatch(createBilling(address));
    dispatch(nextStep());
  };

  const handleApplyShipping = (value: number) => {
    dispatch(applyShipping(value));
  };

  const handleReset = () => {
    if (completed) {
      dispatch(resetCart());
      replace(PATH_SHOP.product.root);
    }
  };

  return (
    <>
      <Head>
        <title>Thanh toán | Book Shop</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Grid container justifyContent={completed ? 'center' : 'flex-start'}>
          <Grid item xs={12} md={8} mt={2}>
            <CheckoutSteps activeStep={activeStep} steps={STEPS} />
          </Grid>
        </Grid>

        {completed ? (
          <CheckoutOrderComplete open={completed} onReset={handleReset} onDownloadPDF={() => {}} />
        ) : (
          <>
            {activeStep === 0 && (
              <CheckoutCart
                onNextStep={handleNextStep}
                onDeleteCart={handleDeleteCart}
                onApplyDiscount={handleApplyDiscount}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
              />
            )}
            {activeStep === 1 && (
              <CheckoutBillingAddress
                onBackStep={handleBackStep}
                onCreateBilling={handleCreateBilling}
              />
            )}
            {activeStep === 2 && billing && (
              <CheckoutPayment
                checkout={checkout}
                onNextStep={handleNextStep}
                onBackStep={handleBackStep}
                onGotoStep={handleGotoStep}
                onApplyShipping={handleApplyShipping}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </Container>
    </>
  );
}
