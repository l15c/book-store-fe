// next
import NextLink from 'next/link';
// @mui
import { Grid, Card, Button, CardHeader, Typography } from '@mui/material';
// routes
import { PATH_SHOP } from 'src/routes/paths';
// redux
import { useSelector } from 'src/redux/store';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
//
import CheckoutSummary from '../CheckoutSummary';
import CheckoutCartProductList from './CheckoutCartProductList';

// ----------------------------------------------------------------------

type Props = {
  onNextStep: VoidFunction;
  onApplyDiscount: (value: number) => void;
  onDeleteCart: (productId: number) => void;
  onIncreaseQuantity: (productId: number) => void;
  onDecreaseQuantity: (productId: number) => void;
};

export default function CheckoutCart({
  onNextStep,
  onApplyDiscount,
  onDeleteCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: Props) {
  const { products, totalItems } = useSelector((state) => state.cart);
  const isEmptyCart = !products.length;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          {!isEmptyCart && (
            <CardHeader
              title={
                <Typography variant="h6">
                  Giỏ hàng
                  <Typography component="span" sx={{ color: 'text.secondary' }}>
                    &nbsp;({totalItems} sản phẩm)
                  </Typography>
                </Typography>
              }
              sx={{ p: 2 }}
            />
          )}

          {!isEmptyCart ? (
            <CheckoutCartProductList
              products={products}
              onDelete={onDeleteCart}
              onIncreaseQuantity={onIncreaseQuantity}
              onDecreaseQuantity={onDecreaseQuantity}
            />
          ) : (
            <EmptyContent
              title=""
              description="Có vẻ như bạn chưa có sản phẩm nào trong giỏ hàng."
              img="/assets/illustrations/illustration_empty_cart.svg"
              actionBtn={
                <Button
                  component={NextLink}
                  href={PATH_SHOP.product.root}
                  variant="contained"
                  sx={{ mt: 2 }}
                >
                  Tiếp tục mua sắm
                </Button>
              }
            />
          )}
        </Card>

        {!isEmptyCart && (
          <Button
            component={NextLink}
            href={PATH_SHOP.product.root}
            color="inherit"
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            sx={{ px: 2 }}
          >
            Tiếp tục mua sắm
          </Button>
        )}
      </Grid>

      <Grid item xs={12} md={4}>
        <CheckoutSummary onApplyVoucher={onApplyDiscount} />
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={isEmptyCart}
          onClick={onNextStep}
        >
          Tiếp tục thanh toán
        </Button>
      </Grid>
    </Grid>
  );
}
