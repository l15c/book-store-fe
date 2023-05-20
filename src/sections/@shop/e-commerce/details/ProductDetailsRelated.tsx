import { useRef } from 'react';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// utils
// @types
import { IBookCompact } from 'src/@types/book';
// components
import Carousel, { CarouselArrows } from 'src/components/carousel';
import { ShopProductCard } from '../shop';

// ----------------------------------------------------------------------

type Props = {
  books: IBookCompact[];
};

export default function ProductDetailsCarousel({ books }: Props) {
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

  if (books.length === 0) return null;

  return (
    <Card sx={{ my: 8 }}>
      <CardHeader title="Sản phẩm liên quan" sx={{ pt: 2, px: 3 }} />
      <Box
        sx={{
          position: 'relative',
          '& .slick-track': {
            ml: 0,
          },
          '& .slick-slide': {
            '& > div': {
              padding: theme.spacing(2, 2),
            },
          },
        }}
      >
        <CarouselArrows filled shape="rounded" onNext={handleNext} onPrevious={handlePrev}>
          <Carousel ref={carouselRef} {...carouselSettings}>
            {books.map((book) => (
              <ShopProductCard key={book.id} book={book} />
            ))}
          </Carousel>
        </CarouselArrows>
      </Box>
    </Card>
  );
}
