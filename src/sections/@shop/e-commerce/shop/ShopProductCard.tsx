import { m } from 'framer-motion';
import NextImage from 'next/image';
import SvgFlashSale from 'src/assets/images/label-flashsale.svg';

// next
import NextLink from 'next/link';
// @mui
import { Box, Card, Link, Stack, Fab, Typography } from '@mui/material';
// routes
import { PATH_SHOP } from 'src/routes/paths';
// utils
import { fCurrency } from 'src/utils/formatNumber';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { addToCart } from 'src/redux/slices/cart';
// @types
import { IBookCompact } from 'src/@types/book';
// components
import Iconify from 'src/components/iconify';
import Label, { LabelColor } from 'src/components/label';
import Image from 'src/components/image';
import TextMaxLine from 'src/components/text-max-line/TextMaxLine';
import { getUrlImage } from 'src/utils/cloudinary';
import { useAuthContext } from 'src/auth/useAuthContext';
import moment from 'moment';

// ----------------------------------------------------------------------

type Props = {
  book: IBookCompact;
  disableFlashSale?: boolean;
};

const genStatus = (quantity: number) => {
  let status = null;
  if (quantity === 0) status = { text: 'Tạm hết hàng', color: 'warning' };
  if (quantity < 0) status = { text: 'Ngừng bán', color: 'default' };
  return status;
};

export default function ShopProductCard({ book, disableFlashSale }: Props) {
  const { name, slug, cover, price, quantity, discount, saleStartDate, saleEndDate } = book;
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const products = useSelector((state) => state.cart.products);

  const isFlashSale = moment().isBetween(saleStartDate, saleEndDate, 'hours', '[]');

  const status = genStatus(quantity);

  const linkTo = PATH_SHOP.product.view(slug);

  const handleAddCart = async () => {
    const newBook = {
      ...book,
      quantity: 1,
      available: quantity,
    };
    try {
      dispatch(addToCart(newBook, products, !!user));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      component={m.div}
      whileHover={{ scale: 1.03 }}
      transition={{
        duration: 0.2,
      }}
      sx={{
        position: 'relative',
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
        // transition: 'all .17s ease-in-out',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[16],
          // transform: 'scale(1.03)',
        },
      }}
    >
      <Link component={NextLink} href={linkTo} underline="none" color="inherit">
        <Box sx={{ position: 'relative', p: 1 }}>
          {status && (
            <Label
              variant="filled"
              color={status.color as LabelColor}
              sx={{
                top: 16,
                right: 16,
                zIndex: 9,
                py: 2,
                position: 'absolute',
                textTransform: 'uppercase',
              }}
            >
              {status.text}
            </Label>
          )}

          {!status &&
            ((isFlashSale && !disableFlashSale && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  p: 0.5,
                  borderRadius: 1,
                  alignItems: 'center',
                  background:
                    'transparent linear-gradient(180deg, #FF6D6D 0%, #FF5247 100%) 0% 0% no-repeat padding-box',
                  position: 'absolute',
                  right: 8,
                  zIndex: 9,
                }}
              >
                <Stack
                  direction="row"
                  mr="auto"
                  spacing={0.5}
                  sx={{
                    bgcolor: '#fff',
                    px: 1,
                    borderRadius: 1,
                  }}
                >
                  <NextImage alt="label-flashsale" src={SvgFlashSale} />
                </Stack>

                <Typography fontWeight={700} color="white">
                  {discount}%
                </Typography>
              </Stack>
            )) ||
              (discount && (
                <Label
                  variant="filled"
                  color="error"
                  sx={{
                    top: 16,
                    right: 16,
                    zIndex: 9,
                    py: 2,
                    position: 'absolute',
                    textTransform: 'uppercase',
                    borderRadius: 0,
                    p: 2,
                    width: 40,
                    height: 40,
                    fontSize: 15,
                    textAlign: 'center',
                    '&:before, &:after': {
                      content: '""',
                      position: 'absolute',
                      height: 40,
                      width: 40,
                      background: 'inherit',
                      zIndex: -1,
                    },
                    '&:before': {
                      transform: 'rotate(30deg)',
                    },
                    '&:after': {
                      transform: 'rotate(60deg)',
                    },
                  }}
                >
                  {`-${discount}%`}
                </Label>
              )))}

          <Fab
            color="warning"
            size="medium"
            className="add-cart-btn"
            onClick={(e) => {
              e.preventDefault();
              handleAddCart();
            }}
            sx={{
              ...(quantity <= 0 && { display: 'none' }),
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
            src={getUrlImage.product(cover, slug)}
            ratio="1/1"
            sx={{ borderRadius: 1.5 }}
          />
        </Box>

        <Stack spacing={2.5} sx={{ p: 3 }}>
          <TextMaxLine line={2} persistent variant="subtitle2">
            {name}
          </TextMaxLine>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box />

            <Stack
              direction="row"
              spacing={0.5}
              sx={{ typography: 'subtitle1', alignItems: 'baseline', lineHeight: 0 }}
            >
              {!!discount && (
                <Box
                  component="span"
                  sx={{
                    color: 'text.disabled',
                    textDecoration: 'line-through',
                    fontSize: 14,
                  }}
                >
                  {fCurrency(price)}
                </Box>
              )}

              <Box component="span" sx={{ color: 'primary.main' }}>
                {fCurrency(price * (1 - (0.01 * discount ?? 0)))}
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Link>
    </Card>
  );
}
