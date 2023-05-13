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

const StyledRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
}));

const StyledGradientText = styled(m.h6)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  backgroundSize: '400%',
  fontSize: `${64 / 16}rem`,
  textAlign: 'center',
  lineHeight: 1,
  padding: 0,
  margin: 0,
  letterSpacing: 8,
}));

// ----------------------------------------------------------------------
// Flash sale
export default function HomeHugePackElements({ data }: Props) {
  return (
    <StyledRoot>
      <Container component={MotionViewport}>
        <Box>
          <m.div variants={varFade().inUp}>
            <StyledGradientText
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
          </m.div>
          <m.div variants={varFade().inUp}>
            <CarouselBasic data={data} />
          </m.div>
        </Box>
      </Container>
    </StyledRoot>
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
    centerPadding: '60px',
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
        settings: { slidesToShow: 1, slidesToScroll: 1, centerPadding: '0' },
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
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <CarouselArrows filled shape="rounded" onNext={handleNext} onPrevious={handlePrev}>
        <Carousel ref={carouselRef} {...carouselSettings}>
          {data.map((item) => (
            <Box key={item.id} sx={{ px: 2, py: 2 }}>
              <ShopProductCard book={item} />
            </Box>
          ))}
        </Carousel>
      </CarouselArrows>
    </Box>
  );
}
