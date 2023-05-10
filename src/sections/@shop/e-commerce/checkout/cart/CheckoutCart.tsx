/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
// next
import NextLink from 'next/link';
// @type
import { ICartItem } from 'src/@types/book';
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
  onAddCart: (product: ICartItem) => void;
  onSelectProductCart: (ids: number[]) => void;
  onIncreaseQuantity: (productId: number) => void;
  onDecreaseQuantity: (productId: number) => void;
};

export default function CheckoutCart({
  onNextStep,
  onApplyDiscount,
  onDeleteCart,
  onAddCart,
  onSelectProductCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: Props) {
  const { products, totalItems, selected } = useSelector((state) => state.cart);
  const isEmptyCart = !products.length;

  const onSelectRow = useCallback(
    (id: number) => {
      const selectedIndex = selected.findIndex((val) => val === id);

      let newSelected: number[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      onSelectProductCart(newSelected);
    },
    [selected]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: number[]) => {
    if (checked) {
      onSelectProductCart(newSelecteds);
      return;
    }
    onSelectProductCart([]);
  }, []);

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
              selected={selected}
              onDelete={onDeleteCart}
              onAddCart={onAddCart}
              onSelectRow={onSelectRow}
              onSelectAllRows={onSelectAllRows}
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
          disabled={isEmptyCart || !selected.length}
          onClick={() => {
            onSelectProductCart(selected);
            onNextStep();
          }}
        >
          Tiếp tục thanh toán
        </Button>
      </Grid>
    </Grid>
  );
}
