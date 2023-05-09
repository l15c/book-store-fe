import { useState } from 'react';
// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import { Button, MenuItem, Box, Stack } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';

// ----------------------------------------------------------------------

const OPTIONS = [
  { value: 'Sold', label: 'Nổi bật' },
  { value: 'ReleaseDate', label: 'Mới nhất' },
  { value: 'Price', label: 'Giá: Giảm dần' },
  { value: 'Price+', label: 'Giá: Tăng dần' },
];

function renderLabel(label: string) {
  return {
    Sold: 'Nổi bật',
    ReleaseDate: 'Mới nhất',
    Price: 'Giá giảm dần',
    'Price+': 'Giá tăng dần',
  }[label];
}

// ----------------------------------------------------------------------

export default function ShopProductSort() {
  const { control, setValue } = useFormContext();
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <Controller
      name="sortBy"
      control={control}
      render={({ field }) => (
        <>
          <Button
            disableRipple
            color="inherit"
            onClick={handleOpenPopover}
            endIcon={
              <Iconify icon={openPopover ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />
            }
            sx={{ fontWeight: 'fontWeightMedium' }}
          >
            Sắp xếp theo:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.5 }}>
              {renderLabel(field.value)}
            </Box>
          </Button>

          <MenuPopover open={openPopover} onClose={handleClosePopover}>
            <Stack spacing={0.5}>
              {OPTIONS.map((option) => (
                <MenuItem
                  key={option.value}
                  selected={option.value === field.value}
                  onClick={() => {
                    handleClosePopover();
                    field.onChange(option.value);
                    setValue('sortDirection', option.value === 'Price+' ? 'asc' : 'desc');
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Stack>
          </MenuPopover>
        </>
      )}
    />
  );
}
