import { useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { IAds } from 'src/api-client/ads';
// @mui
import { Box, Container, Grid } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
// utils
import { getUrlImage } from 'src/utils/cloudinary';
import { bgGradient } from '../../utils/cssStyles';
// config
import { HEADER } from '../../config-global';
// components
import Image from '../../components/image/Image';
import { MotionContainer } from '../../components/animate';
import Carousel, { CarouselArrows, CarouselDots } from '../../components/carousel';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  ...bgGradient({
    color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94),
    imgUrl: '/assets/background/overlay_2.jpg',
  }),
  [theme.breakpoints.up('md')]: {
    top: HEADER.H_DESKTOP,
    position: 'sticky',
  },
}));

// ----------------------------------------------------------------------

export default function HomeHero({ data }: { data: IAds[] }) {
  const { scrollYProgress } = useScroll();
  const [hide, setHide] = useState(false);

  useEffect(
    () =>
      scrollYProgress.on('change', (scrollHeight) => {
        if (scrollHeight > 0.8) {
          setHide(true);
        } else {
          setHide(false);
        }
      }),
    [scrollYProgress]
  );

  return (
    <StyledRoot sx={{ ...(hide && { opacity: 0 }) }}>
      <Container component={MotionContainer} disableGutters sx={{ height: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={9}>
            <Box sx={{ borderRadius: { xs: 0, md: 2 }, overflow: 'hidden' }}>
              <CarouselHome data={data.slice(0, 4)} />
            </Box>
          </Grid>

          <Grid item md={3} display={{ xs: 'none', md: 'block' }}>
            {data.slice(6, 8).map((e) => (
              <Grid item xs={12} key={e.id}>
                <Image
                  alt="Catalog"
                  src={getUrlImage.single(`${e.image}`, '/ads')}
                  sx={{
                    '& *': {
                      backgroundSize: 'contain !important',
                      objectFit: 'contain !important',
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {data.slice(6).map((e) => (
            <Grid key={e.id} item sm={3} display={{ xs: 'none', sm: 'block' }}>
              <Image alt="Card" src={getUrlImage.single(`${e.image}`, '/ads')} />
            </Grid>
          ))}
        </Grid>
        {/* <CarouselAutoSlide
          data={[
            ...Array(8).fill({
              title: 'Banner',
              image:
                '',
            }),
          ]}
        /> */}
      </Container>
    </StyledRoot>
  );
}

type CarouselItemProps = {
  id: number;
  image: string;
};

type CarouselProps = {
  data: IAds[];
};

function CarouselHome({ data }: CarouselProps) {
  const theme = useTheme();
  const carouselRef = useRef<Carousel | null>(null);

  const carouselSettings = {
    dots: true,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselDots({
      rounded: true,
      sx: { position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)' },
    }),
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
        cursor: 'pointer',
        height: 1,
        position: 'relative',
        '& .slick-list': {
          height: 1,
          boxShadow: theme.customShadows.z16,
        },
      }}
    >
      <CarouselArrows filled shape="rounded" onNext={handleNext} onPrevious={handlePrev}>
        <Carousel ref={carouselRef} {...carouselSettings}>
          {data.map(({ id, image }) => (
            <CarouselItem key={id} id={id} image={getUrlImage.single(`${image}`, `/ads`)} />
          ))}
        </Carousel>
      </CarouselArrows>
    </Box>
  );
}

// ----------------------------------------------------------------------

function CarouselItem({ image, id }: CarouselItemProps) {
  return <Image alt={`${id}`} src={image} ratio="21/9" sx={{ lineHeight: 0 }} />;
}

// function CarouselAutoSlide({ data }: CarouselProps) {
//   const carouselRef = useRef<Carousel | null>(null);

//   const settings = {
//     infinite: true,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     speed: 2000,
//     pauseOnHover: true,
//     pauseOnFocus: true,
//     cssEase: 'linear',
//   };

//   return (
//     <Box sx={{ mt: 2, height: 100 }}>
//       <Carousel ref={carouselRef} {...settings}>
//         {data.map(({ title, image }) => (
//           <CarouselItemAuto key={title} title={title} image={image} />
//         ))}
//       </Carousel>
//     </Box>
//   );
// }

// function CarouselItemAuto({ image, title }: CarouselItemProps) {
//   return (
//     <Image
//       alt={title}
//       src={image}
//       sx={{
//         cursor: 'pointer',
//         height: '120px',
//         mx: 2,
//         lineHeight: 0,
//       }}
//     />
//   );
// }
