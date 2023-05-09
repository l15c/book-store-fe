// @mui
import {
  Box,
  Stack,
  Divider,
  TableRow,
  TableCell,
  Typography,
  IconButton,
  Link,
  Tooltip,
  Checkbox,
} from '@mui/material';
import Zoom from '@mui/material/Zoom';
// utils
import { fCurrency } from 'src/utils/formatNumber';
// @types
import { ICartItem } from 'src/@types/book';
// components
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { IncrementerButton } from 'src/components/custom-input';
import { getLinkImage } from 'src/utils/cloudinary';
import Label from 'src/components/label';
import NextLink from 'next/link';
import { PATH_SHOP } from 'src/routes/paths';

// ----------------------------------------------------------------------

type CheckoutProductListRowProps = {
  row: ICartItem;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDelete: VoidFunction;
  onAddCart: (product: ICartItem) => void;
  onDecrease: VoidFunction;
  onIncrease: VoidFunction;
};

export default function CheckoutCartProduct({
  row,
  selected,
  onSelectRow,
  onDelete,
  onAddCart,
  onDecrease,
  onIncrease,
}: CheckoutProductListRowProps) {
  const { name, price, cover, quantity, available, slug, discount } = row;

  const stopSale = available < 0;

  return (
    <TableRow selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Image
          alt={name}
          src={getLinkImage(cover, `products/${slug}`) as string}
          sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }}
        />

        <Stack spacing={0.5} sx={{ maxWidth: 200 }}>
          <Link color="text.primary" component={NextLink} href={PATH_SHOP.product.view(slug)}>
            <Tooltip
              title={name}
              arrow
              slotProps={{ tooltip: { sx: { fontSize: 13 } } }}
              TransitionComponent={Zoom}
            >
              <Typography noWrap variant="subtitle2">
                {name}
              </Typography>
            </Tooltip>
          </Link>

          <Stack
            direction="row"
            alignItems="center"
            sx={{ typography: 'body2', color: 'text.secondary' }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Hiện có sẵn: {available}
            </Typography>
            <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
            {!stopSale && !!discount && (
              <Label variant="soft" color="error">
                {`Giảm giá ${discount}%`}
              </Label>
            )}
          </Stack>
        </Stack>
      </TableCell>

      <TableCell>{fCurrency(price * (1 - discount / 100))}</TableCell>

      <TableCell>
        <Box sx={{ width: 96, textAlign: 'right' }}>
          <IncrementerButton
            enableInput
            min={1}
            max={Math.min(available, 999)}
            quantity={quantity}
            setQuantity={(value: number) => {
              onAddCart({ ...row, quantity: value - quantity });
            }}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            disabledDecrease={stopSale || quantity <= 1}
            disabledIncrease={stopSale || quantity >= available}
          />
        </Box>
      </TableCell>

      <TableCell align="right">{fCurrency(price * (1 - discount / 100) * quantity)}</TableCell>

      <TableCell align="right">
        <IconButton
          color="error"
          onClick={() => {
            onDelete();
            if (selected) onSelectRow();
          }}
        >
          <Iconify icon="eva:trash-2-outline" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
