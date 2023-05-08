import moment from 'moment';
import Image from 'next/image';
import SvgFlashSale from 'src/assets/images/label-flashsale.svg';
import { useState } from 'react';
import useCountdown from 'src/hooks/useCountdown';
// next
import { useRouter } from 'next/router';
// @mui
import {
  Box,
  Button,
  Divider,
  IconButton,
  Rating,
  Stack,
  Typography,
  Grid,
  LinearProgress,
  styled,
  linearProgressClasses,
  Link,
} from '@mui/material';
// routes
import { PATH_SHOP } from '../../../../routes/paths';
// utils
import { fCurrency, fShortenNumber } from '../../../../utils/formatNumber';
// @types
import { IBook, ICartItem } from '../../../../@types/book';
// components
import { IncrementerButton } from '../../../../components/custom-input';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';

// ----------------------------------------------------------------------
const socials = [
  {
    value: 'facebook',
    name: 'FaceBook',
    icon: 'eva:facebook-fill',
    color: '#1877F2',
    path: 'https://www.facebook.com/caitlyn.kerluke',
  },
  {
    value: 'instagram',
    name: 'Instagram',
    icon: 'ant-design:instagram-filled',
    color: '#E02D69',
    path: 'https://www.instagram.com/caitlyn.kerluke',
  },
  {
    value: 'linkedin',
    name: 'Linkedin',
    icon: 'eva:linkedin-fill',
    color: '#007EBB',
    path: 'https://www.linkedin.com/caitlyn.kerluke',
  },
  {
    value: 'twitter',
    name: 'Twitter',
    icon: 'eva:twitter-fill',
    color: '#00AAEC',
    path: 'https://www.twitter.com/caitlyn.kerluke',
  },
];

type Props = {
  book: IBook;
  cart: ICartItem[];
  scrollToTab: () => void;
  onAddCart: (cartItem: ICartItem) => void;
  onGotoStep: (step: number) => void;
};

type TimeBlockProps = {
  value: string;
};

function TimeBlock({ value }: TimeBlockProps) {
  return (
    <Box sx={{ p: '2px 4px', borderRadius: 1, bgcolor: '#000', color: '#fff', letterSpacing: 1 }}>
      {value}
    </Box>
  );
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 16,
  borderRadius: 49,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#ffcfce',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 49,
    backgroundColor: '#fff',
  },
}));

type LabelFlashSaleProps = { sold: number; quantity: number; endDate: string };

function LabelFlashSale({ sold, quantity, endDate }: LabelFlashSaleProps) {
  const { days, hours, minutes, seconds } = useCountdown(new Date(endDate));

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        p: 0.5,
        borderRadius: { xs: 0, md: 1 },
        alignItems: 'center',
        background:
          'transparent linear-gradient(180deg, #FF6D6D 0%, #FF5247 100%) 0% 0% no-repeat padding-box',
      }}
    >
      <Stack
        direction="row"
        mr="auto"
        spacing={0.5}
        sx={{
          bgcolor: '#fff',
          py: 1,
          px: 2,
          borderRadius: 1,
          fontSize: '1em',
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        <Image alt="label-flashsale" src={SvgFlashSale} style={{ marginRight: '4px' }} />
        {+days > 0 && (
          <>
            <TimeBlock value={days} /> <div>:</div>
          </>
        )}
        <TimeBlock value={hours} /> <div>:</div>
        <TimeBlock value={minutes} /> <div>:</div>
        <TimeBlock value={seconds} />
      </Stack>
      <Stack flexGrow={1} position="relative">
        <BorderLinearProgress
          variant="determinate"
          value={(sold / quantity) * 100 || 0}
          sx={{ mr: 0.5 }}
        />
        <Typography
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#F63B2F',
            fontSize: '0.9em',
            fontWeight: 700,
          }}
        >
          Đã bán: {sold}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default function ProductDetailsSummary({
  book,
  cart,
  scrollToTab,
  onAddCart,
  onGotoStep,
  ...other
}: Props) {
  const { push } = useRouter();

  const {
    id,
    name,
    price,
    quantity,
    discount,
    saleStartDate,
    saleEndDate,
    author,
    genre,
    publishedYear,
    publisher,
    saleQuantity,
    saleSold,
  } = book;
  const reviews = book.review ?? [];

  const stopSale = quantity < 0;
  const outStock = quantity === 0;
  const sale = !!discount;
  const isFlashSale = moment().isBetween(saleStartDate, saleEndDate, 'hours', '[]');

  const alreadyProduct = cart.map((item) => item.id).includes(id);
  const [qtyBuy, setQtyBuy] = useState(1);

  // const isMaxQuantity =
  //   cart.filter((item) => item.id === id).map((item) => item.quantity)[0] >= quantity;

  const handleBuyNow = () => {
    try {
      if (!alreadyProduct) {
        onAddCart({
          ...book,
          quantity: qtyBuy,
          available: quantity,
        });
      }
      onGotoStep(0);
      push(PATH_SHOP.product.checkout);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCart = () => {
    try {
      onAddCart({
        ...book,
        quantity: qtyBuy,
        available: quantity,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Stack
      spacing={3}
      {...(!isFlashSale && {
        sx: {
          pt: {
            md: 3.5,
          },
        },
      })}
      {...other}
    >
      <Stack spacing={2}>
        {stopSale && (
          <Label
            variant="filled"
            color="error"
            sx={{ fontSize: 16, textTransform: 'uppercase', mr: 'auto', py: 2.5, px: 2 }}
          >
            Ngừng kinh doanh
          </Label>
        )}
        {outStock && (
          <Label
            variant="filled"
            color="error"
            sx={{ fontSize: 16, textTransform: 'uppercase', mr: 'auto', py: 2.5, px: 2 }}
          >
            Tạm hết hàng
          </Label>
        )}
        {!stopSale && !outStock && isFlashSale && (
          <LabelFlashSale quantity={saleQuantity} sold={saleSold} endDate={saleEndDate!} />
        )}

        <Typography variant="h4">{name}</Typography>

        <Grid container rowSpacing={1} mt="8px !important">
          {[
            { label: 'Tác giả', value: author.name },
            { label: 'Thể loại', value: genre.name },
            { label: 'Nhà xuất bản', value: publisher.name },
            { label: 'Năm xuất bản', value: publishedYear },
          ].map((e, idx) => (
            <Grid key={idx} item xs={6}>
              <Typography fontSize={14}>
                {e.label}: <strong>{e.value}</strong>
              </Typography>
            </Grid>
          ))}
        </Grid>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Rating
            value={reviews.reduce((a, b) => a + b.rating, 0) / reviews.length}
            precision={0.1}
            readOnly
          />

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <Link onClick={scrollToTab} color="warning.main" sx={{ cursor: 'pointer' }}>
              ({fShortenNumber(reviews.length) || 'Chưa có '} đánh giá)
            </Link>
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h4">
            {sale && (
              <Box
                component="span"
                sx={{ color: 'text.disabled', textDecoration: 'line-through', mr: 0.5 }}
              >
                {fCurrency(price)}
              </Box>
            )}

            {fCurrency(price * (1 - discount / 100))}
          </Typography>
          {!stopSale && sale && (
            <Label variant="filled" color="error" sx={{ fontSize: 16, py: 2 }}>
              {`-${discount}%`}
            </Label>
          )}
        </Stack>
      </Stack>
      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" sx={{ height: 36, lineHeight: '36px' }}>
          Số lượng
        </Typography>

        <Stack spacing={1}>
          <IncrementerButton
            enableInput
            min={1}
            max={Math.min(quantity, 999)}
            quantity={qtyBuy}
            disabledDecrease={stopSale || qtyBuy <= 1}
            disabledIncrease={stopSale || qtyBuy >= quantity}
            setQuantity={(value: number) => {
              setQtyBuy(value);
            }}
            onIncrease={() => setQtyBuy((prev) => prev + 1)}
            onDecrease={() => setQtyBuy((prev) => prev - 1)}
          />

          {!stopSale && (
            <Typography
              variant="caption"
              component="div"
              sx={{ textAlign: 'right', color: 'text.secondary' }}
            >
              Hiện có sẵn: {quantity}
            </Typography>
          )}
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack direction="row" spacing={2}>
        <Button
          fullWidth
          disabled={stopSale || outStock}
          size="large"
          color="warning"
          variant="contained"
          startIcon={<Iconify icon="ic:round-add-shopping-cart" />}
          onClick={handleAddCart}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Thêm vào giỏ hàng
        </Button>

        <Button
          fullWidth
          size="large"
          disabled={stopSale || outStock}
          onClick={handleBuyNow}
          variant="contained"
        >
          Mua ngay
        </Button>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="center">
        {socials.map((social) => (
          <IconButton key={social.name}>
            <Iconify icon={social.icon} color={social.color} />
          </IconButton>
        ))}
      </Stack>
    </Stack>
  );
}
