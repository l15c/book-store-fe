import NextLink from 'next/link';
import { useEffect, useState } from 'react';
// @mui
import { Badge, Button, Divider, IconButton, Stack, Typography, Link } from '@mui/material';
import { alpha } from '@mui/material/styles';
// components
// import { ICheckoutCartItem } from 'src/@types/product';
import { IconButtonAnimate } from 'src/components/animate';
// import { ColorPreview } from 'src/components/color-utils';
import { IncrementerButton } from 'src/components/custom-input';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
// import Label from 'src/components/label';
import MenuPopover from 'src/components/menu-popover';
import Scrollbar from 'src/components/scrollbar';
// redux
import { decreaseQuantity, deleteCart, getCart, increaseQuantity } from 'src/redux/slices/cart';
import { useDispatch, useSelector } from 'src/redux/store';
import { PATH_SHOP } from 'src/routes/paths';
// utils
import { fCurrency } from 'src/utils/formatNumber';
import { ICartItem } from 'src/@types/book';
import TextMaxLine from 'src/components/text-max-line/TextMaxLine';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 120;

export default function CartPopover() {
  const dispatch = useDispatch();
  const { products, totalItems } = useSelector((state) => state.cart);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch, products]);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
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

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <IconButtonAnimate
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={{
          width: 40,
          height: 40,
          ...(openPopover && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
          }),
        }}
      >
        <Badge badgeContent={totalItems} color="error">
          <Iconify icon="eva:shopping-cart-fill" sx={{ width: '24px', height: '24px' }} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        disabledArrow
        sx={{ width: 480 }}
      >
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Iconify icon="eva:shopping-bag-outline" sx={{ width: '24px', height: '24px', mr: 1 }} />
          {' Giỏ hàng'}
        </Typography>
        <Divider />
        {totalItems ? (
          <Scrollbar sx={{ height: ITEM_HEIGHT * 3 }}>
            {products.map((product) => (
              <CartProductPopover
                key={product.id}
                product={product}
                onDelete={handleDeleteCart}
                onDecreaseQuantity={handleDecreaseQuantity}
                onIncreaseQuantity={handleIncreaseQuantity}
              />
            ))}
          </Scrollbar>
        ) : (
          <Stack justifyContent="center">
            <Image
              disabledEffect
              alt="empty content"
              src="/assets/illustrations/illustration_empty_cart.svg"
              sx={{
                height: 160,
                my: 2,
                ' img': {
                  objectFit: 'contain',
                },
              }}
            />

            <Typography textAlign="center" gutterBottom fontSize="16px" fontWeight="bold">
              Hiện chưa có sản phẩm
            </Typography>
          </Stack>
        )}

        <Divider sx={{ my: 1 }} />
        {totalItems ? (
          <NextLink href={PATH_SHOP.product.checkout} passHref>
            <Button fullWidth variant="contained" sx={{ py: 1, mb: 1 }}>
              Thanh toán
            </Button>
          </NextLink>
        ) : (
          <NextLink href={PATH_SHOP.product.root} passHref>
            <Button fullWidth variant="contained" sx={{ py: 1 }}>
              Mua sắm ngay
            </Button>
          </NextLink>
        )}
      </MenuPopover>
    </>
  );
}
// ----------------------------------------------------------------------------

type Props = {
  product: ICartItem;
  onDelete: (id: number) => void;
  onDecreaseQuantity: (id: number) => void;
  onIncreaseQuantity: (id: number) => void;
};

function CartProductPopover({ product, onDelete, onDecreaseQuantity, onIncreaseQuantity }: Props) {
  const { id, name, slug, cover, quantity, price, available } = product;
  return (
    <>
      <Stack direction="row" alignItems="center" position="relative" sx={{ height: ITEM_HEIGHT }}>
        <IconButton onClick={() => onDelete(id)} sx={{ position: 'absolute', top: 4, right: 0 }}>
          <Iconify icon="eva:close-fill" />
        </IconButton>
        <Image alt={name} src={cover} sx={{ width: 75, height: 75, borderRadius: 1.5, mr: 2 }} />
        <Stack spacing={1} flex={1}>
          <Link
            component={NextLink}
            href={PATH_SHOP.product.view(slug)}
            sx={{ cursor: 'pointer', mr: 5 }}
          >
            <TextMaxLine line={2} variant="subtitle2">
              {name}
            </TextMaxLine>
          </Link>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontSize="14px" fontWeight="bold">
              {fCurrency(price)}
            </Typography>
            <IncrementerButton
              quantity={quantity}
              onDecrease={() => onDecreaseQuantity(id)}
              onIncrease={() => onIncreaseQuantity(id)}
              disabledDecrease={quantity <= 1}
              disabledIncrease={quantity >= available}
              sx={{ py: 0.25, fontSize: '14px' }}
            />
          </Stack>
        </Stack>
      </Stack>
      <Divider sx={{ borderStyle: 'dashed' }} />
    </>
  );
}