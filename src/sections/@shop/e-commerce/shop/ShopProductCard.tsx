// next
import NextLink from 'next/link';
// @mui
import { Box, Card, Link, Stack, Fab } from '@mui/material';
// routes
import { PATH_SHOP } from 'src/routes/paths';
// utils
import { fCurrency } from 'src/utils/formatNumber';
// redux
import { useDispatch } from 'src/redux/store';
import { addToCart } from 'src/redux/slices/cart';
// @types
import { IBookCompact } from 'src/@types/book';
// components
import Iconify from 'src/components/iconify';
import Label, { LabelColor } from 'src/components/label';
import Image from 'src/components/image';
import TextMaxLine from 'src/components/text-max-line/TextMaxLine';
import { getLinkImage } from 'src/utils/cloudinary';

// ----------------------------------------------------------------------

type Props = {
  book: IBookCompact;
};

const genStatus = (quantity: number, discount: number) => {
  let status = null;
  if (discount) status = { text: 'Giảm giá', color: 'warning' };
  if (quantity === 0) status = { text: 'Tạm hết hàng', color: 'error' };
  if (quantity < 0) status = { text: 'Ngừng bán', color: 'default' };
  return status;
};

export default function ShopProductCard({ book }: Props) {
  const { name, slug, cover, price, quantity, discount } = book;
  const dispatch = useDispatch();

  const status = genStatus(quantity, discount);

  const linkTo = PATH_SHOP.product.view(slug);

  const handleAddCart = async () => {
    const newBook = {
      ...book,
      quantity: 1,
      available: quantity,
    };
    try {
      dispatch(addToCart(newBook));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
        transition: 'all .17s ease-in-out',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[24],
          transform: 'scale(1.03)',
        },
      }}
    >
      <Link component={NextLink} href={linkTo} underline="none" color="inherit">
        <Box sx={{ position: 'relative', p: 1 }}>
          {status && (
            <Label
              variant="filled"
              color={(status.color as LabelColor) ?? 'default'}
              sx={{
                top: 16,
                right: 16,
                zIndex: 9,
                position: 'absolute',
                textTransform: 'uppercase',
              }}
            >
              {status.text}
            </Label>
          )}

          <Fab
            color="warning"
            size="medium"
            className="add-cart-btn"
            onClick={(e) => {
              e.preventDefault();
              handleAddCart();
            }}
            sx={{
              right: 16,
              bottom: 16,
              zIndex: 9,
              opacity: 0,
              position: 'absolute',
              transition: (theme) =>
                theme.transitions.create('all', {
                  easing: theme.transitions.easing.easeInOut,
                  duration: theme.transitions.duration.shorter,
                }),
            }}
          >
            <Iconify icon="ic:round-add-shopping-cart" />
          </Fab>

          <Image
            alt={name}
            src={getLinkImage(cover, `products/${slug}`) as string}
            ratio="1/1"
            sx={{ borderRadius: 1.5 }}
          />
        </Box>

        <Stack spacing={2.5} sx={{ p: 3 }}>
          <TextMaxLine line={2} variant="subtitle2">
            {name}
          </TextMaxLine>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box />

            <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
              {!!discount && (
                <Box
                  component="span"
                  sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
                >
                  {fCurrency(price)}
                </Box>
              )}

              <Box component="span">{fCurrency(price * (1 - (0.01 * discount ?? 0)))}</Box>
            </Stack>
          </Stack>
        </Stack>
      </Link>
    </Card>
  );
}
