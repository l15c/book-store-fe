import { forwardRef } from 'react';
import { NumberFormatValues } from 'react-number-format';
// @mui
import { alpha } from '@mui/material/styles';
import { Stack, IconButton, StackProps, Input } from '@mui/material';
// components
import Iconify from '../iconify';
import NumericFormatCustom from '../numeric-format-custom/NumericFormatCustom';

// ----------------------------------------------------------------------

interface IncrementerButtonProps extends StackProps {
  name?: string;
  quantity: number;
  enableInput?: boolean;
  min?: number;
  max?: number;
  setQuantity?: (value: number) => void;
  disabledIncrease?: boolean;
  disabledDecrease?: boolean;
  onIncrease: VoidFunction;
  onDecrease: VoidFunction;
}

const IncrementerButton = forwardRef<HTMLDivElement, IncrementerButtonProps>(
  (
    {
      quantity,
      enableInput,
      min = -Infinity,
      max = Infinity,
      setQuantity = () => {},
      onIncrease,
      onDecrease,
      disabledIncrease,
      disabledDecrease,
      sx,
      ...other
    },
    ref
  ) => (
    <Stack
      ref={ref}
      flexShrink={0}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        mb: 0.5,
        py: 0.5,
        px: 0.75,
        width: 96,
        borderRadius: 1,
        border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
        ...sx,
      }}
      {...other}
    >
      <IconButton
        size="small"
        color="inherit"
        onClick={onDecrease}
        disabled={disabledDecrease}
        sx={{ color: 'text.secondary' }}
      >
        <Iconify icon="eva:minus-fill" width={16} />
      </IconButton>

      {enableInput ? (
        <Input
          value={quantity}
          disableUnderline
          disabled={disabledDecrease && disabledIncrease}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            setQuantity(Math.max(Number(e.target.value), min));
          }}
          inputComponent={NumericFormatCustom}
          inputProps={{
            min,
            max,
            sx: { textAlign: 'center', p: 0 },
            isAllowed: (_val: NumberFormatValues) => {
              const { floatValue = 0 } = _val;
              return floatValue >= min && floatValue <= max;
            },
          }}
        />
      ) : (
        quantity
      )}

      <IconButton
        size="small"
        color="inherit"
        onClick={onIncrease}
        disabled={disabledIncrease}
        sx={{ color: 'text.secondary' }}
      >
        <Iconify icon="eva:plus-fill" width={16} />
      </IconButton>
    </Stack>
  )
);

export default IncrementerButton;
