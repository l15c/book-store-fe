import moment from 'moment';
import NextLink from 'next/link';
import { useRef } from 'react';
import { m } from 'framer-motion';
// @mui
import { Box, Button, Card, Container, Link, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// utils
// @types
import { IBookCompact } from 'src/@types/book';
// components
import Carousel, { CarouselArrows } from 'src/components/carousel';
import { MotionViewport, varFade } from 'src/components/animate';
import { ShopProductCard } from '../@shop/e-commerce/shop';
import { LabelFlashSale } from '../@shop/e-commerce/details/ProductDetailsSummary';

// ----------------------------------------------------------------------

type Props = {
  data: IBookCompact[];
};

export default function HomeFlashSale({ data }: Props) {
  const theme = useTheme();

  const carouselRef = useRef<Carousel | null>(null);
  const maxTime = moment.max(data.map((e) => moment(e.saleEndDate)));

  const carouselSettings = {
    dots: false,
    arrows: false,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    infinite: false,
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 4 },
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 3, slidesToScroll: 3 },
      },
      {
        breakpoint: 720,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  const handlePrev = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  if (data.length === 0) return null;

  return (
    <Box sx={{ bgcolor: '#f0f0f0', py: 10 }}>
      <Container component={MotionViewport} disableGutters>
        <m.div variants={varFade().inUp}>
          <Card>
            <LabelFlashSale quantity={0} endDate={maxTime.toISOString()} />
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                '& .slick-track': {
                  ml: 0,
                  py: 2,
                },
                '& .slick-slide': {
                  '& > div': {
                    padding: theme.spacing(2, 2),
                  },
                },
              }}
            >
              <CarouselArrows filled onNext={handleNext} onPrevious={handlePrev}>
                <Carousel ref={carouselRef} {...carouselSettings}>
                  {data.map((book, idx) => (
                    <ShopProductCard key={idx} book={book} disableFlashSale />
                  ))}
                </Carousel>
              </CarouselArrows>
            </Box>

            <Button
              variant="outlined"
              component={NextLink}
              href="/products?flashSale=true"
              sx={{ display: 'flex', width: 'fit-content', mx: 'auto', mb: 2, px: 4 }}
            >
              Xem thêm
            </Button>
          </Card>
        </m.div>
      </Container>
    </Box>
  );
}
