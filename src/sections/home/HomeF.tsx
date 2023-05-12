import { m } from 'framer-motion';
import moment from 'moment';
import NextImage from 'next/image';
import { useEffect, useRef, useState } from 'react';
// @type
import { IBookCompact } from 'src/@types/book';
// @mui
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import NextLink from 'next/link';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
// utils
import Carousel, { CarouselArrowIndex } from 'src/components/carousel';
import Lightbox from 'src/components/lightbox';
import TextMaxLine from 'src/components/text-max-line';
import { getUrlImage } from 'src/utils/cloudinary';
import { bgGradient } from 'src/utils/cssStyles';
import { fCurrency, fShortenNumber } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';
import {
  MotionViewport,
  varBounce,
  varContainer,
  varFade,
  varSlide,
} from '../../components/animate';
import { LabelFlashSale } from '../@shop/e-commerce/details/ProductDetailsSummary';

// ----------------------------------------------------------------------
const THUMB_SIZE = 120;

type StyledThumbnailsContainerProps = {
  length: number;
};

const StyledThumbnailsContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'length',
})<StyledThumbnailsContainerProps>(({ length, theme }) => ({
  margin: theme.spacing(0, 'auto'),
  position: 'relative',

  '& .slick-slide': {
    opacity: 0.48,
    '&.slick-current': {
      opacity: 1,
    },
    '& > div': {
      padding: theme.spacing(0, 0.75),
    },
  },

  ...(length === 1 && {
    maxWidth: THUMB_SIZE * 1 + 16,
  }),
  ...(length === 2 && {
    maxWidth: THUMB_SIZE * 2 + 32,
  }),
  ...((length === 3 || length === 4) && {
    maxWidth: THUMB_SIZE * 3 + 48,
  }),
  ...(length >= 5 && {
    maxWidth: THUMB_SIZE * 6,
  }),
  ...(length > 2 && {
    '&:before, &:after': {
      ...bgGradient({
        direction: 'to left',
        startColor: `${alpha(theme.palette.background.default, 0)} 0%`,
        endColor: `${theme.palette.background.default} 100%`,
      }),
      top: 0,
      zIndex: 9,
      content: "''",
      height: '100%',
      position: 'absolute',
      width: (THUMB_SIZE * 2) / 3,
    },
    '&:after': {
      right: 0,
      transform: 'scaleX(-1)',
    },
  }),
}));

const StyledRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(3, 0),
  bgcolor: '#f0f0f0',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8, 0),
  },
}));

// ----------------------------------------------------------------------
type Props = {
  data: IBookCompact[];
};

export default function HomeF({ data }: Props) {
  const [current, setCurrent] = useState(data[0]);
  const [count, setCount] = useState(0);

  return (
    <StyledRoot>
      <Container component={MotionViewport}>
        <m.div variants={varFade().inUp}>
          <Card sx={{ p: 2 }} elevation={24}>
            <Grid container columnSpacing={2}>
              <Grid item xs={12} md={9}>
                <DetailSummary count={count} book={current} />
              </Grid>

              <Grid item xs={12} md={3}>
                <ProductScroll
                  data={data}
                  selected={current}
                  onChangeValue={(_d) => {
                    setCurrent(_d);
                    setCount(count + 1);
                  }}
                />
              </Grid>
            </Grid>
          </Card>
        </m.div>
      </Container>
    </StyledRoot>
  );
}

type CardItemsProps = {
  data: IBookCompact[];
  onChangeValue: (data: IBookCompact) => void;
  selected: IBookCompact;
};

function ProductScroll({
  data,
  selected,

  onChangeValue,
}: CardItemsProps) {
  const scrollRef = useRef(null);

  return (
    <Paper ref={scrollRef} component={m.div} variants={varContainer()} sx={{ height: 480 }}>
      <Scrollbar>
        {data.slice(0, 5).map((book) => (
          <Card
            key={book.id}
            component={m.div}
            viewport={{
              root: scrollRef,
              margin: '-50% 0px -50% 0px ',
            }}
            onViewportEnter={() => onChangeValue(book)}
            sx={{
              height: '320px',
              m: 1,
              position: 'relative',
            }}
          >
            <NextImage
              alt={book.name}
              src={getUrlImage.product(book.cover, book.slug)}
              fill
              priority
              style={{ objectFit: 'contain' }}
            />
            <Box
              sx={{
                top: 0,
                width: 1,
                height: 1,
                transition: 'opacity 0.5s ease-in',

                opacity: selected.id === book.id ? 0 : 0.3,
                position: 'absolute',
                background: '#000',
              }}
            />
          </Card>
        ))}
      </Scrollbar>
    </Paper>
  );
}

function DetailSummary({ count, book }: { count: number; book: IBookCompact }) {
  const {
    quantity,
    discount,
    saleStartDate,
    saleEndDate,
    saleQuantity,
    saleSold,
    name,
    cover,
    images,
    price,
    releaseDate,
    slug,
    sold,
  } = book;
  const stopSale = quantity < 0;
  const outStock = quantity === 0;
  const sale = !!discount;
  const isFlashSale = moment().isBetween(saleStartDate, saleEndDate, 'hours', '[]');

  // Carousel
  const theme = useTheme();
  const carousel1 = useRef<Carousel | null>(null);
  const carousel2 = useRef<Carousel | null>(null);
  const [nav1, setNav1] = useState<Carousel>();
  const [nav2, setNav2] = useState<Carousel>();

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedImage, setSelectedImage] = useState<number>(-1);

  const fullImages = getUrlImage.products([cover, ...images], book.slug);

  const imagesLightbox = fullImages.map((img: string) => ({ src: img }));

  const handleOpenLightbox = (imageUrl: string) => {
    const imageIndex = imagesLightbox.findIndex((image) => image.src === imageUrl);
    setSelectedImage(imageIndex);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };

  const carouselSettings1 = {
    dots: false,
    arrows: false,
    slidesToShow: 1,
    draggable: false,
    slidesToScroll: 1,
    adaptiveHeight: true,
    beforeChange: (current: number, next: number) => setCurrentIndex(next),
  };

  const carouselSettings2 = {
    dots: false,
    arrows: false,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: true,
    centerPadding: '0px',
    slidesToShow: fullImages.length > 3 ? 3 : fullImages.length,
  };

  useEffect(() => {
    if (carousel1.current) {
      console.log(carousel1.current);
      setNav1(carousel1.current);
    }
    if (carousel2.current) {
      console.log(carousel2.current);
      setNav2(carousel2.current);
    }
  }, [count]);

  useEffect(() => {
    carousel1.current?.slickGoTo(currentIndex);
  }, [currentIndex]);

  const handlePrev = () => {
    carousel2.current?.slickPrev();
  };

  const handleNext = () => {
    carousel2.current?.slickNext();
  };

  const renderLargeImg = (
    <Box sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
      <Carousel {...carouselSettings1} asNavFor={nav2} ref={carousel1}>
        {fullImages.map((img) => (
          <NextImage
            key={img}
            alt="product"
            src={img}
            onClick={() => handleOpenLightbox(img)}
            height={480}
            width={480}
            style={{ objectFit: 'contain' }}
            priority
          />
        ))}
      </Carousel>

      <CarouselArrowIndex
        index={currentIndex}
        total={fullImages.length}
        onNext={handleNext}
        onPrevious={handlePrev}
        sx={{ right: '50%', transform: 'translateX(50%)' }}
      />
    </Box>
  );

  const renderThumbnails = (
    <StyledThumbnailsContainer length={fullImages.length}>
      <Carousel {...carouselSettings2} asNavFor={nav1} ref={carousel2}>
        {fullImages.map((img, index) => (
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 1.5,
              cursor: 'pointer',
              ...(currentIndex === index && {
                border: `solid 2px ${theme.palette.primary.main}`,
              }),
            }}
          >
            <NextImage
              key={img}
              alt="thumbnail"
              src={img}
              width={90}
              height={120}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Box>
        ))}
      </Carousel>
    </StyledThumbnailsContainer>
  );

  return (
    <Grid container spacing={2} key={count} sx={{ height: 1, width: 1 }}>
      <Grid item xs={6} component={m.div} {...varSlide().inLeft}>
        <>
          <Box
            sx={{
              '& .slick-slide': {
                float: theme.direction === 'rtl' ? 'right' : 'left',
              },
            }}
          >
            {renderLargeImg}
          </Box>

          <Lightbox
            index={selectedImage}
            slides={imagesLightbox}
            open={selectedImage >= 0}
            close={handleCloseLightbox}
            onGetCurrentIndex={(index) => setCurrentIndex(index)}
          />
        </>
      </Grid>
      <Grid item xs={6} mt={2}>
        <Stack spacing={2} height={1} justifyContent="space-between">
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

            <Link component={NextLink} href={`/products/${slug}`}>
              <TextMaxLine line={3} persistent variant="h4">
                <m.div {...varFade().inDown}>{name}</m.div>
              </TextMaxLine>
            </Link>

            <Grid
              container
              rowSpacing={1}
              mt="8px !important"
              component={m.div}
              {...varSlide().inDown}
            >
              {[
                { label: 'Ngày xuất bản', value: fDate(releaseDate) },
                { label: 'Đã bán', value: fShortenNumber(sold) },
              ].map((e, idx) => (
                <Grid key={idx} item xs={6}>
                  <Typography fontSize={14}>
                    {e.label}: <strong>{e.value}</strong>
                  </Typography>
                </Grid>
              ))}
            </Grid>

            {/* <Stack direction="row" alignItems="center" spacing={1}>
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
          </Stack> */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              component={m.div}
              {...varSlide().inDown}
            >
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
                <Label
                  component={m.div}
                  {...varBounce().in}
                  variant="filled"
                  color="error"
                  sx={{ fontSize: 16, py: 2 }}
                >
                  {`-${discount}%`}
                </Label>
              )}
            </Stack>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack direction="row" spacing={2} mt={4}>
            <Button
              fullWidth
              disabled={stopSale || outStock}
              size="large"
              color="warning"
              variant="contained"
              startIcon={<Iconify icon="ic:round-add-shopping-cart" />}
              // onClick={handleAddCart}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Thêm vào giỏ hàng
            </Button>

            <Button
              fullWidth
              size="large"
              disabled={stopSale || outStock}
              // onClick={handleBuyNow}
              variant="contained"
            >
              Mua ngay
            </Button>
          </Stack>

          <Box
            sx={{
              '& .slick-slide': {
                float: theme.direction === 'rtl' ? 'right' : 'left',
              },
            }}
          >
            {renderThumbnails}
          </Box>

          {/* <Stack direction="row" alignItems="center" justifyContent="center">
            {socials.map((social) => (
              <IconButton key={social.name}>
                <Iconify icon={social.icon} color={social.color} />
              </IconButton>
            ))}
          </Stack> */}
        </Stack>
      </Grid>
    </Grid>
  );
}
