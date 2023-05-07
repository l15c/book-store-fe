import { NotFoundIllustration } from 'src/assets/illustrations';
// @mui
import { Box, BoxProps, Stack, Typography } from '@mui/material';
// @type
import { IBookCompact } from 'src/@types/book';
// assets
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
//
import ShopProductCard from './ShopProductCard';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  books: IBookCompact[];
  loading: boolean;
}

export default function ShopProductList({ books, loading, ...other }: Props) {
  return books.length === 0 ? (
    <Stack alignItems="center" height={1}>
      <Typography variant="h4" paragraph>
        Không tìm thấy kết quả phù hợp
      </Typography>

      <NotFoundIllustration sx={{ my: 2, height: 320 }} />
    </Stack>
  ) : (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
      }}
      {...other}
    >
      {(loading ? [...Array(12)] : books).map((book, index) =>
        book ? <ShopProductCard key={book.id} book={book} /> : <SkeletonProductItem key={index} />
      )}
    </Box>
  );
}
