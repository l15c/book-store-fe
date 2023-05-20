// @mui
import { Stack, TableCell, TableRow, Typography } from '@mui/material';
// @types
import { IOrder } from 'src/@types/order';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
import { fDate } from '../../../../utils/formatTime';
// components
import { CustomAvatar } from '../../../../components/custom-avatar';
import Label from '../../../../components/label';
import { COLOR_STATUS } from '../constant';

// ----------------------------------------------------------------------

type Props = {
  row: IOrder;
  onViewRow: VoidFunction;
};

export default function InvoiceTableRow({ row, onViewRow }: Props) {
  const {
    shipPhone,
    totalPrice,
    deliveryFee,
    dateOfPayment,
    displayAddress,
    orderDate,
    shipName,
    status,
  } = row;

  return (
    <TableRow hover onClick={onViewRow} sx={{ cursor: 'pointer' }}>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <CustomAvatar name={shipName} />

          <div>
            <Stack direction="row" spacing={1}>
              <Typography variant="subtitle2" noWrap>
                {shipName}
              </Typography>
              <Typography
                noWrap
                variant="body2"
                sx={{
                  color: 'text.disabled',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  WebkitLineClamp: 1,
                  maxWidth: 380,
                }}
              >
                ({shipPhone})
              </Typography>
            </Stack>

            <Typography
              noWrap
              variant="body2"
              sx={{
                color: 'text.disabled',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitLineClamp: 1,
                maxWidth: 380,
              }}
            >
              {displayAddress || '-'}
            </Typography>
          </div>
        </Stack>
      </TableCell>

      <TableCell align="center">{fDate(orderDate)}</TableCell>

      <TableCell align="center">{dateOfPayment ? fDate(dateOfPayment) : '-'}</TableCell>

      <TableCell align="center">{fCurrency(totalPrice + deliveryFee)}</TableCell>

      <TableCell align="center">
        <Label variant="soft" color={COLOR_STATUS[status]} sx={{ p: 1 }}>
          {status}
        </Label>
      </TableCell>
    </TableRow>
  );
}
