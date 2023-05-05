// @mui
import { Box, BoxProps } from '@mui/material';
// @type
import { IBookCompact } from 'src/@types/book';
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
    console.log(books)
  return (
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
