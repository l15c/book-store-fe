// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Radio,
  Stack,
  Input,
  Badge,
  Button,
  Drawer,
  Rating,
  Divider,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
// config
import { NAV } from 'src/config-global';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ColorMultiPicker } from 'src/components/color-utils';
import { RHFMultiCheckbox, RHFRadioGroup, RHFSlider } from 'src/components/hook-form';
import { IAuthor, IGenre, IPublisher } from 'src/@types/book';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { forwardRef } from 'react';
import { fCurrency } from 'src/utils/formatNumber';
import { debounce } from 'lodash';
import NumericFormatCustom from '../../../../components/numeric-format-custom';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  isDefault: boolean;
  priceRange: [number, number];
  genresOptions: IGenre[];
  authorsOptions: IAuthor[];
  publishersOptions: IPublisher[];
  onOpen: VoidFunction;
  onClose: VoidFunction;
  onResetFilter: VoidFunction;
};

export default function ShopFilterDrawer({
  open,
  priceRange,
  genresOptions,
  authorsOptions,
  publishersOptions,
  onOpen,
  onClose,
  isDefault,
  onResetFilter,
}: Props) {
  const { control, setValue } = useFormContext();

  const marksLabel = [...Array(21)].map((_, index) => {
    const value = index * 10;

    const firstValue = index === 0 ? `${value}đ` : `${value}đ`;

    return {
      value,
      label: index % 4 ? '' : firstValue,
    };
  });

  // const getSelected = (selectedItems: string[], item: string) =>
  //   selectedItems.includes(item)
  //     ? selectedItems.filter((value) => value !== item)
  //     : [...selectedItems, item];

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={onOpen}
      >
        Bộ lọc
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        BackdropProps={{
          invisible: true,
        }}
        PaperProps={{
          sx: { width: NAV.W_BASE },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pl: 2, pr: 1, py: 2 }}
        >
          <Typography variant="subtitle1">Filters</Typography>

          <IconButton onClick={onClose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 2.5 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle1"> Gender </Typography>
              {/* <RHFMultiCheckbox name="gender" options={FILTER_GENDER_OPTIONS} sx={{ width: 1 }} /> */}
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1"> Category </Typography>
              {/* <RHFRadioGroup name="category" options={FILTER_CATEGORY_OPTIONS} /> */}
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1"> Color </Typography>
            </Stack>

            <Stack spacing={1} sx={{ pb: 2 }}>
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                Giá tiền
              </Typography>

              <InputRange type="min" />
              <InputRange type="max" />

              <RHFSlider
                name="priceRange"
                step={Math.round((priceRange[1] - priceRange[0]) / 20)}
                min={priceRange[0]}
                max={priceRange[1]}
                // marks={marksLabel}
                onChange={(e, value) => setValue('priceRange', value)}
                getAriaValueText={(value) => fCurrency(value)}
                valueLabelFormat={(value) => fCurrency(value)}
                sx={{ alignSelf: 'center', width: `calc(100% - 20px)` }}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1">Rating</Typography>

              {/* <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    {FILTER_RATING_OPTIONS.map((item, index) => (
                      <FormControlLabel
                        key={item}
                        value={item}
                        control={
                          <Radio
                            disableRipple
                            color="default"
                            icon={<Rating readOnly value={4 - index} />}
                            checkedIcon={<Rating readOnly value={4 - index} />}
                            sx={{
                              '&:hover': { bgcolor: 'transparent' },
                            }}
                          />
                        }
                        label="& Up"
                        sx={{
                          my: 0.5,
                          borderRadius: 1,
                          '&:hover': { opacity: 0.48 },
                          ...(field.value.includes(item) && {
                            bgcolor: 'action.selected',
                          }),
                        }}
                      />
                    ))}
                  </RadioGroup>
                )}
              /> */}
            </Stack>
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <Badge
            color="error"
            variant="dot"
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            invisible={isDefault}
            sx={{ width: 1 }}
          >
            <Button
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              variant="outlined"
              onClick={onResetFilter}
              startIcon={<Iconify icon="eva:trash-2-outline" />}
            >
              Xóa bộ lọc
            </Button>
          </Badge>
        </Box>
      </Drawer>
    </>
  );
}

// ----------------------------------------------------------------------

type InputRangeProps = {
  type: 'min' | 'max';
};

function InputRange({ type }: InputRangeProps) {
  const { control, setValue } = useFormContext();
  const handleBlurInputRange = (value: [number, number]) => {
    const min = value[0];

    const max = value[1];

    if (min < 0) {
      setValue('priceRange', [0, max]);
    }
    if (min > 1000000) {
      setValue('priceRange', [1000000, max]);
    }
    if (max < 0) {
      setValue('priceRange', [min, 0]);
    }
    if (max > 1000000) {
      setValue('priceRange', [min, 1000000]);
    }
  };

  return (
    <Controller
      name="priceRange"
      control={control}
      render={({ field }) => {
        const isMin = type === 'min';
        const min = field.value[0];
        const max = field.value[1];

        return (
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ width: 1 }}>
            <Typography
              variant="caption"
              sx={{
                flexShrink: 0,
                color: 'text.disabled',
                fontWeight: 'fontWeightBold',
                width: 120,
              }}
            >
              {type === 'min' ? 'Thấp nhất (vnđ)' : 'Cao nhất (vnđ)'}
            </Typography>

            <Input
              disableUnderline
              fullWidth
              inputComponent={NumericFormatCustom}
              size="small"
              value={isMin ? min : max}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (isMin) {
                  field.onChange([value, max]);
                } else {
                  field.onChange([min, value]);
                }
              }}
              onBlur={() => handleBlurInputRange(field.value)}
              sx={{
                pr: 1,
                py: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                '& .MuiInput-input': { p: 0, textAlign: 'right' },
              }}
            />
          </Stack>
        );
      }}
    />
  );
}
