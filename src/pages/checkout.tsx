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
  addToCart,
  setSelected,
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
import { ICartItem } from 'src/@types/book';
import { IUserAddress } from 'src/@types/user';
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
import { useAuthContext } from 'src/auth/useAuthContext';
import addressApi from 'src/api-client/address';

// ----------------------------------------------------------------------

const STEPS = ['Giỏ hàng', 'Địa chỉ', 'Thanh toán'];

// ----------------------------------------------------------------------

EcommerceCheckoutPage.getLayout = (page: React.ReactElement) => <ShopLayout>{page}</ShopLayout>;

// ----------------------------------------------------------------------

export default function EcommerceCheckoutPage() {
  const { replace } = useRouter();
  const { user } = useAuthContext();
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
    dispatch(deleteCart(productId, products, !!user));
  };

  const handleIncreaseQuantity = (productId: number) => {
    dispatch(increaseQuantity(productId, products, !!user));
  };

  const handleDecreaseQuantity = (productId: number) => {
    dispatch(decreaseQuantity(productId, products, !!user));
  };

  const handleCreateBilling = (address: IUserAddress) => {
    dispatch(createBilling(address));
    addressApi
      .checkFee({ to_district_id: address.district, to_ward_code: `${address.ward}` })
      .then((res) => handleApplyShipping(res.total));
    dispatch(nextStep());
  };

  const handleApplyShipping = (value: number) => {
    dispatch(applyShipping(value));
  };

  const handleAddCart = (product: ICartItem) => {
    dispatch(addToCart(product, products, !!user));
  };

  const handleSelectProductCart = (p: number[]) => {
    dispatch(setSelected(p));
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
        <title>Thanh toán | Book Store</title>
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
                onAddCart={handleAddCart}
                onSelectProductCart={handleSelectProductCart}
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
                onNextStep={handleNextStep}
                onBackStep={() => {
                  handleBackStep();
                  handleApplyShipping(0);
                }}
                onGotoStep={handleGotoStep}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </Container>
    </>
  );
}
