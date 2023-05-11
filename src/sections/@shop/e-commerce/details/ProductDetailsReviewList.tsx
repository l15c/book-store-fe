import { useState, useEffect } from 'react';
// @mui
import { LoadingLinear } from 'src/components/loading-screen/LoadingScreen';
import { Stack, Rating, Avatar, Pagination, Typography } from '@mui/material';
// @types
import { IReview } from 'src/@types/book';
// utils
import { getLinkImage } from 'src/utils/cloudinary';
import { fDate } from '../../../../utils/formatTime';
// import { fShortenNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  reviews: IReview[];
};

const PAGE_SIZE = 8;
export default function ProductDetailsReviewList({ loading, reviews }: Props) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    document
      .getElementById('list-review')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }, [page]);

  if (reviews.length === 0) return null;
  return loading ? (
    <LoadingLinear enableScroll sx={{ position: 'unset', height: 240 }} />
  ) : (
    <>
      <Stack
        id="list-review"
        spacing={5}
        sx={{
          mt: -5,
          pt: 10,
          pl: {
            xs: 2.5,
            md: 0,
          },
          pr: {
            xs: 2.5,
            md: 5,
          },
        }}
      >
        {reviews.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </Stack>

      <Stack
        alignItems={{
          xs: 'center',
          md: 'flex-end',
        }}
        sx={{
          my: 5,
          mr: { md: 5 },
        }}
      >
        {Math.ceil(reviews.length / PAGE_SIZE) > 1 && (
          <Pagination
            count={Math.ceil(reviews.length / PAGE_SIZE)}
            page={page + 1}
            onChange={(e, p) => setPage(p - 1)}
            showLastButton
            showFirstButton
            boundaryCount={2}
          />
        )}
      </Stack>
    </>
  );
}

// ----------------------------------------------------------------------

type ReviewItemProps = {
  review: IReview;
};

function ReviewItem({ review }: ReviewItemProps) {
  const { fullName, comment, createdAt, imageUrl, isPurchased, rating, userId } = review;

  // const [isHelpful, setIsHelpful] = useState(false);

  return (
    <Stack
      spacing={2}
      direction={{
        xs: 'column',
        md: 'row',
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        direction={{
          xs: 'row',
          md: 'column',
        }}
        sx={{
          width: { md: 240 },
          textAlign: { md: 'center' },
        }}
      >
        <Avatar
          src={getLinkImage(imageUrl, `customers/${userId}`) as string}
          sx={{
            width: { md: 48 },
            height: { md: 48 },
          }}
        />

        <Stack spacing={{ md: 0.5 }}>
          <Typography variant="subtitle2" noWrap>
            {fullName}
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {fDate(createdAt)}
          </Typography>
        </Stack>
      </Stack>

      <Stack spacing={1} flexGrow={1} justifyContent="center">
        <Rating size="small" value={rating} readOnly />

        {isPurchased && (
          <Typography
            variant="caption"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'success.main',
            }}
          >
            <Iconify icon="ic:round-verified" width={16} sx={{ mr: 0.5 }} />
            Đã mua hàng
          </Typography>
        )}

        <Typography variant="body2">{comment}</Typography>

        {/* <Stack
          spacing={1}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          direction={{ xs: 'column', sm: 'row' }}
        >
          {!isHelpful && (
            <Typography variant="subtitle2">Was this review helpful to you?</Typography>
          )}

          <Button
            size="small"
            color="inherit"
            startIcon={<Iconify icon={!isHelpful ? 'ic:round-thumb-up' : 'eva:checkmark-fill'} />}
            onClick={() => setIsHelpful(!isHelpful)}
          >
            {isHelpful ? 'Helpful' : 'Thank'}({fShortenNumber(!isHelpful ? helpful : helpful + 1)})
          </Button>
        </Stack> */}
      </Stack>
    </Stack>
  );
}
