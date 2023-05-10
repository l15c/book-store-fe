import sumBy from 'lodash/sumBy';
import intersectionWith from 'lodash/intersectionWith';
// @mui
import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  InputAdornment,
} from '@mui/material';
import { useSelector } from 'src/redux/store';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

type Props = {
  onEdit?: VoidFunction;
  enableEdit?: boolean;
  onApplyVoucher?: (discount: number) => void;
  enableVoucher?: boolean;
};

export default function CheckoutSummary({
  onEdit,
  enableEdit = false,
  onApplyVoucher: onApplyDiscount,
  enableVoucher: enableDiscount = false,
}: Props) {
  const { products, selected } = useSelector((state) => state.cart);
  const { shipping, activeStep } = useSelector((state) => state.checkout);

  const productsSelected = intersectionWith(products, selected, (p, id) => p.id === id);

  const total = sumBy(productsSelected, (p) => p.price * p.quantity);
  const discount = sumBy(productsSelected, (p) => p.quantity * (p.price * (p.discount / 100)));

  const displayShipping = !shipping && activeStep === 2 ? 'Miễn phí' : '-';

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Thông tin đơn hàng"
        action={
          enableEdit && (
            <Button size="small" onClick={onEdit} startIcon={<Iconify icon="eva:edit-fill" />}>
              Thay đổi
            </Button>
          )
        }
      />

      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Tạm tính
            </Typography>
            <Typography variant="subtitle2">{fCurrency(total)}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Giảm giá
            </Typography>
            <Typography variant="subtitle2">{discount ? fCurrency(-discount) : '-'}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Phí vận chuyển
            </Typography>
            <Typography variant="subtitle2">
              {shipping ? fCurrency(shipping) : displayShipping}
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle1">Tổng tiền</Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                {fCurrency(total - discount + shipping)}
              </Typography>
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                (Đã bao gồm VAT)
              </Typography>
            </Box>
          </Stack>

          {enableDiscount && onApplyDiscount && (
            <TextField
              fullWidth
              placeholder="Discount codes / Gifts"
              value="DISCOUNT5"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={() => onApplyDiscount(5)} sx={{ mr: -0.5 }}>
                      Áp dụng
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
