import { fCurrency } from 'src/utils/formatNumber';
import { sentenceCase } from 'change-case';
// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Chip, Stack, Button, StackProps } from '@mui/material';
// @type
import { IProductFilter } from '../../../../@types/product';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

type Props = {
  isFiltered: boolean;
  onResetFilter: VoidFunction;
};

export default function ShopTagFiltered({ isFiltered, onResetFilter }: Props) {
  const { watch, setValue } = useFormContext();

  const values = watch();

  const {
    authors: filterAuthor,
    genres: filterGenre,
    publishers: filterPublisher,
    priceRange: filterPriceRange,
    rating: filterRating,
  } = values as IProductFilter;

  const min = filterPriceRange[0];

  const max = filterPriceRange[1];

  const handleRemoveAuthor = (id: number) => {
    const newValue = filterAuthor.filter((item) => item.id !== id);
    setValue('authors', newValue, { shouldDirty: true });
  };

  const handleRemoveGenre = (id: number) => {
    const newValue = filterGenre.filter((item) => item.id !== id);
    setValue('genres', newValue, { shouldDirty: true });
  };

  const handleRemovePublisher = (id: number) => {
    const newValue = filterPublisher.filter((item) => item.id !== id);
    setValue('publishers', newValue, { shouldDirty: true });
  };

  const handleRemovePrice = () => {
    setValue('priceRange', [0, 1000000], { shouldDirty: true });
  };

  const handleRemoveRating = () => {
    setValue('rating', '');
  };

  return (
    <Stack flexGrow={1} direction="row" flexWrap="wrap" alignItems="center">
      {!!filterGenre.length && (
        <Panel label="Thể loại:" sx={{ whiteSpace: 'nowrap' }}>
          {filterGenre.map((genre) => (
            <Chip
              key={genre.id}
              label={genre.name}
              size="small"
              onDelete={() => handleRemoveGenre(genre.id)}
              sx={{ m: 0.5 }}
            />
          ))}
        </Panel>
      )}

      {!!filterAuthor.length && (
        <Panel label="Tác giả:" sx={{ whiteSpace: 'nowrap' }}>
          {filterAuthor.map((author) => (
            <Chip
              key={author.id}
              label={author.name}
              size="small"
              onDelete={() => handleRemoveAuthor(author.id)}
              sx={{ m: 0.5 }}
            />
          ))}
        </Panel>
      )}

      {!!filterPublisher.length && (
        <Panel label="Nhà xuất bản:" sx={{ whiteSpace: 'nowrap' }}>
          {filterPublisher.map((publisher) => (
            <Chip
              key={publisher.id}
              label={publisher.name}
              size="small"
              onDelete={() => handleRemovePublisher(publisher.id)}
              sx={{
                m: 0.5,
              }}
            />
          ))}
        </Panel>
      )}

      {(min !== 0 || max !== 1000000) && (
        <Panel label="Đơn giá (VNĐ):">
          <Chip
            size="small"
            label={`${fCurrency(min)} - ${fCurrency(max)}`}
            onDelete={handleRemovePrice}
            sx={{ m: 0.5 }}
          />
        </Panel>
      )}

      {!!filterRating && (
        <Panel label="Đánh giá:">
          <Chip
            size="small"
            label={sentenceCase(filterRating)}
            onDelete={handleRemoveRating}
            sx={{ m: 0.5 }}
          />
        </Panel>
      )}

      {isFiltered && (
        <Button
          color="error"
          variant="outlined"
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
          sx={{ px: 3, borderRadius: 999 }}
        >
          Xóa bộ lọc
        </Button>
      )}
    </Stack>
  );
}

// ----------------------------------------------------------------------

interface PanelProps extends StackProps {
  label: string;
}

function Panel({ label, children, sx }: PanelProps) {
  return (
    <Stack
      direction="row"
      alignItems="stretch"
      sx={{
        m: 0.5,
        borderRadius: 1,
        overflow: 'hidden',
        border: (theme) => `solid 1px ${theme.palette.divider}`,
        ...sx,
      }}
    >
      <Stack
        component="span"
        direction="row"
        alignItems="center"
        sx={{
          px: 1,
          typography: 'subtitle2',
          color: 'text.secondary',
          bgcolor: 'background.neutral',
          borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        {label}
      </Stack>

      <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
        {children}
      </Stack>
    </Stack>
  );
}
