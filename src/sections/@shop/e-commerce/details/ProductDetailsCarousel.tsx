import { useState, useRef, useEffect } from 'react';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// utils
import { bgGradient } from 'src/utils/cssStyles';
// @types
import { IBook } from 'src/@types/book';
// components
import Image from 'src/components/image';
import Lightbox from 'src/components/lightbox';
import Carousel, { CarouselArrowIndex } from 'src/components/carousel';
import { getUrlImage } from 'src/utils/cloudinary';

// ----------------------------------------------------------------------

const THUMB_SIZE = 64;

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

// ----------------------------------------------------------------------

type Props = {
  book: IBook;
};

export default function ProductDetailsCarousel({ book }: Props) {
  const theme = useTheme();

  const { cover, images } = book;

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
      setNav1(carousel1.current);
    }
    if (carousel2.current) {
      setNav2(carousel2.current);
    }
  }, []);

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
    <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
      <Carousel {...carouselSettings1} asNavFor={nav2} ref={carousel1}>
        {fullImages.map((img) => (
          <Image
            key={img}
            alt="product"
            src={img}
            onClick={() => handleOpenLightbox(img)}
            sx={{
              width: 480,
              height: 480,
              m: 'auto',
              cursor: 'zoom-in',
              '& *': {
                objectFit: 'contain !important',
                backgroundSize: 'contain !important',
              },
            }}
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
          <Image
            key={img}
            disabledEffect
            alt="thumbnail"
            src={img}
            sx={{
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: 1.5,
              cursor: 'pointer',
              ...(currentIndex === index && {
                border: `solid 2px ${theme.palette.primary.main}`,
              }),
            }}
          />
        ))}
      </Carousel>
    </StyledThumbnailsContainer>
  );

  return (
    <>
      <Box
        sx={{
          '& .slick-slide': {
            float: theme.direction === 'rtl' ? 'right' : 'left',
          },
        }}
      >
        {renderLargeImg}

        {renderThumbnails}
      </Box>

      <Lightbox
        index={selectedImage}
        slides={imagesLightbox}
        open={selectedImage >= 0}
        close={handleCloseLightbox}
        onGetCurrentIndex={(index) => setCurrentIndex(index)}
      />
    </>
  );
}
