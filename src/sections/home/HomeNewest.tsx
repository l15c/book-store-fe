import { useRef } from 'react';
import { m } from 'framer-motion';
// @mui
import { Box, Container, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IBookCompact } from 'src/@types/book';
import Carousel, { CarouselArrows } from 'src/components/carousel';
import { textGradient } from 'src/utils/cssStyles';
// components
import { MotionViewport, varFade } from '../../components/animate';
import { ShopProductCard } from '../@shop/e-commerce/shop';

// ----------------------------------------------------------------------

const StyledGradientText = styled(m.h6)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  backgroundSize: '400%',
  fontSize: '3rem',
  textAlign: 'center',
  lineHeight: '4rem',
  padding: 0,
  margin: 0,
  letterSpacing: 4,
}));

// ----------------------------------------------------------------------
// Flash sale
export default function HomeNewest({ data }: Props) {
  return (
    <Container component={MotionViewport} sx={{ py: 8 }} disableGutters>
      <StyledGradientText
        variants={varFade().inUp}
        animate={{ backgroundPosition: '200% center' }}
        transition={{
          repeatType: 'reverse',
          ease: 'linear',
          duration: 20,
          repeat: Infinity,
        }}
      >
        Sách mới nhất
      </StyledGradientText>

      <m.div variants={varFade().inUp}>
        <CarouselBasic data={data} />
      </m.div>
    </Container>
  );
}

// ----------------------------------------------------------------------
type Props = {
  data: IBookCompact[];
};
function CarouselBasic({ data }: Props) {
  const theme = useTheme();

  const carouselRef = useRef<Carousel | null>(null);

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

  return (
    <Box
      sx={{
        position: 'relative',
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
          {data.map((item) => (
            <ShopProductCard key={item.id} book={item} />
          ))}
        </Carousel>
      </CarouselArrows>
    </Box>
  );
}
