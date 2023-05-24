import { useMutation, useQueryClient } from '@tanstack/react-query';
// @mui
import {
  Stack,
  TableCell,
  TableRow,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import orderApi from 'src/api-client/order';
// utils
import { useAuthContext } from 'src/auth/useAuthContext';
import { fCurrency } from '../../../../utils/formatNumber';
import { fDate } from '../../../../utils/formatTime';
// @types
import { IOrder } from '../../../../@types/order';
// components
import { CustomAvatar } from '../../../../components/custom-avatar';
import Label from '../../../../components/label';
import { COLOR_STATUS } from '../../../@shop/invoice/constant';
import { GROUP_STATUS } from '../constant';

// ----------------------------------------------------------------------

type Props = {
  row: IOrder;
  onViewRow: VoidFunction;
};

export default function InvoiceTableRow({ row, onViewRow }: Props) {
  const { shipPhone, totalPrice, deliveryFee, displayAddress, orderDate, shipName, status } = row;

  const { user } = useAuthContext();

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: { orderId: string; status: string }) => orderApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'], refetchType: 'all' });
    },
  });

  const handleChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    mutate({ orderId: row.id, status: event.target.value });
  };

  return (
    <TableRow hover sx={{ cursor: 'pointer' }}>
      <TableCell onClick={onViewRow}>
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
                  maxWidth: 300,
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
                maxWidth: 300,
              }}
            >
              {displayAddress || '-'}
            </Typography>
          </div>
        </Stack>
      </TableCell>

      <TableCell align="center">{fDate(orderDate)}</TableCell>

      <TableCell align="center">{fCurrency(totalPrice + deliveryFee)}</TableCell>

      <TableCell align="center">
        <Label variant="soft" color={COLOR_STATUS[status]} sx={{ p: 1 }}>
          {status}
        </Label>
      </TableCell>

      <TableCell>
        {user?.roleId === 4 && (
          <TextField
            fullWidth
            size="small"
            select
            label="Trạng thái"
            value=""
            {...(isLoading && {
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: 1.5 }}>
                    <CircularProgress size={20} />
                  </InputAdornment>
                ),
              },
            })}
            onChange={handleChangeStatus}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: { maxHeight: 220 },
                },
              },
            }}
            sx={{
              maxWidth: { md: 200 },
            }}
          >
            {[
              ...Object.keys(GROUP_STATUS)
                .map((key) => GROUP_STATUS[key])
                .flat(),
            ]
              .filter((e) => e !== status)
              .map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    mx: 1,
                    borderRadius: 0.75,
                    typography: 'body2',
                  }}
                >
                  {option}
                </MenuItem>
              ))}
          </TextField>
        )}
      </TableCell>
    </TableRow>
  );
}
