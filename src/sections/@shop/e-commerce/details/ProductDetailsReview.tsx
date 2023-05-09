import { useState } from 'react';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
// @mui
import { Divider, Typography, Rating, Button, LinearProgress, Stack, Box } from '@mui/material';
// @types
import { IReview } from 'src/@types/book';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';
//
import ProductDetailsReviewList from './ProductDetailsReviewList';
import ProductDetailsReviewNewDialog from './ProductDetailsNewReviewForm';

// ----------------------------------------------------------------------

type Props = {
  reviews: IReview[];
};

export default function ProductDetailsReview({ reviews }: Props) {
  const totalReview = reviews.length;
  const totalRating = reviews.reduce((a, b) => a + b.rating, 0) / totalReview || 0;
  const [openReview, setOpenReview] = useState(false);

  const handleOpenReview = () => {
    setOpenReview(true);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
  };

  // const total = sumBy(reviews, (review) => review.rating);

  const _ratings = groupBy(reviews, 'rating');

  const ratings = Array(5)
    .fill(0)
    .map((_, start) => ({
      name: `${start + 1} sao`,
      starCount: sumBy(_ratings[start + 1] || [], (review) => review.rating),
      reviewCount: (_ratings[start + 1] || []).length,
    }));

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{
            pt: { xs: 5, md: 0 },
            pb: { xs: 3, md: 0 },
          }}
        >
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Đánh giá sản phẩm
          </Typography>

          <Typography variant="h2">{totalRating.toFixed(1)}/5</Typography>

          <Rating readOnly value={Number(totalRating.toFixed(1))} precision={0.1} />

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            ({fShortenNumber(totalReview)} đánh giá)
          </Typography>
        </Stack>

        <Stack
          spacing={1.5}
          sx={{
            p: 3,
            py: { md: 4 },
            borderLeft: (theme) => ({ md: `dashed 1px ${theme.palette.divider}` }),
            borderRight: (theme) => ({ md: `dashed 1px ${theme.palette.divider}` }),
          }}
        >
          {ratings.map((rating) => (
            <ProgressItem key={rating.name} star={rating} total={totalReview} />
          ))}
        </Stack>

        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            pt: { xs: 3, md: 0 },
            pb: { xs: 5, md: 0 },
          }}
        >
          <Button
            color="primary"
            size="large"
            onClick={handleOpenReview}
            variant="outlined"
            startIcon={<Iconify icon="eva:edit-fill" />}
          >
            Viết đánh giá sản phẩm
          </Button>
        </Stack>
      </Box>

      <Divider />

      <ProductDetailsReviewList reviews={reviews} />

      <ProductDetailsReviewNewDialog open={openReview} onClose={handleCloseReview} />
    </>
  );
}

// ----------------------------------------------------------------------

type ProgressItemProps = {
  star: {
    name: string;
    starCount: number;
    reviewCount: number;
  };
  total: number;
};

function ProgressItem({ star, total }: ProgressItemProps) {
  const { name, reviewCount = 0 } = star;
  return (
    <Stack direction="row" alignItems="center">
      <Typography variant="subtitle2" sx={{ width: 42 }}>
        {name}
      </Typography>

      <LinearProgress
        color="inherit"
        variant="determinate"
        value={(reviewCount / total) * 100 || 0}
        sx={{
          mx: 2,
          flexGrow: 1,
        }}
      />

      <Typography
        variant="body2"
        sx={{
          minWidth: 48,
          color: 'text.secondary',
        }}
      >
        {fShortenNumber(reviewCount)}
      </Typography>
    </Stack>
  );
}
