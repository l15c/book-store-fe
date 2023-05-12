// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';
import { IOrder } from 'src/@types/order';
import Logo from 'src/components/logo/BookShop';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
//
import InvoiceToolbar from './InvoiceToolbar';
import { COLOR_STATUS } from '../constant';

// ----------------------------------------------------------------------

const StyledRowResult = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  order?: IOrder;
};

export default function InvoiceDetails({ order }: Props) {
  if (!order) {
    return null;
  }

  const {
    totalPrice,
    dayOfPayment,
    deliveryFee,
    discountPrice,
    displayAddress,
    orderDetails = [],
    shipNote,
    shipPhone,
    id,
    orderDate,
    shipName,
    status,
  } = order;
  return (
    <>
      <InvoiceToolbar order={order} />

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Logo disabledLink />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant="soft"
                color={COLOR_STATUS[status] || 'default'}
                sx={{ textTransform: 'uppercase', mb: 1, p: 2 }}
              >
                {status}
              </Label>

              <Typography variant="body2">{`Mã đơn hàng: ${id}`}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Thông tin người nhận
            </Typography>

            <Typography variant="body2">
              <Typography variant="body2" component="span" color="text.secondary">
                Tên người nhận:&nbsp;
              </Typography>
              <b>{shipName}</b>
            </Typography>

            <Typography variant="body2">
              <Typography variant="body2" component="span" color="text.secondary">
                <Typography variant="body2" component="span" color="text.secondary">
                  Số điện thoại:&nbsp;
                </Typography>
              </Typography>
              {shipPhone}
            </Typography>

            <Typography variant="body2">
              <Typography variant="body2" component="span" color="text.secondary">
                Địa chỉ:&nbsp;
              </Typography>
              {displayAddress}
            </Typography>

            <Typography variant="body2">
              <Typography variant="body2" component="span" color="text.secondary">
                Ghi chú:&nbsp;
              </Typography>
              {shipNote}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={3} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Ngày đặt hàng
            </Typography>

            <Typography variant="body2">{fDate(orderDate)}</Typography>
          </Grid>

          <Grid item xs={12} sm={3} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Ngày thanh toán
            </Typography>

            <Typography variant="body2">
              {dayOfPayment ? fDate(dayOfPayment) : 'Chưa thanh toán'}
            </Typography>
          </Grid>
        </Grid>

        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell width={40}>#</TableCell>

                  <TableCell align="left">Tên sản phẩm</TableCell>

                  <TableCell align="center">Số lượng</TableCell>

                  <TableCell align="right">Đơn giá</TableCell>
                  <TableCell align="center">Giảm giá</TableCell>

                  <TableCell align="right">Thành tiền</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orderDetails.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell align="left">
                      <Box sx={{ maxWidth: 560 }}>
                        <Typography variant="subtitle2">{row.name}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="center">{row.quantity}</TableCell>

                    <TableCell align="right">{fCurrency(row.price)}</TableCell>
                    <TableCell align="center">{row.discount ? `${row.discount}%` : '-'}</TableCell>
                    <TableCell align="right">
                      {fCurrency(row.price * (1 - row.discount / 100) * row.quantity)}
                    </TableCell>
                  </TableRow>
                ))}

                <StyledRowResult>
                  <TableCell colSpan={4} />

                  <TableCell align="right" sx={{ typography: 'body1' }}>
                    <Box sx={{ mt: 2 }} />
                    Đã giảm giá
                  </TableCell>

                  <TableCell
                    align="right"
                    width={120}
                    sx={{ color: 'error.main', typography: 'body1' }}
                  >
                    <Box sx={{ mt: 2 }} />
                    {discountPrice && fCurrency(discountPrice)}
                  </TableCell>
                </StyledRowResult>

                <StyledRowResult>
                  <TableCell colSpan={4} />

                  <TableCell align="right" sx={{ typography: 'body1' }}>
                    Tạm tính
                  </TableCell>

                  <TableCell align="right" width={120} sx={{ typography: 'body1' }}>
                    {fCurrency(totalPrice)}
                  </TableCell>
                </StyledRowResult>

                <StyledRowResult>
                  <TableCell colSpan={4} />

                  <TableCell align="right" sx={{ typography: 'body1' }}>
                    Phí vận chuyển
                  </TableCell>

                  <TableCell align="right" width={120} sx={{ typography: 'body1' }}>
                    {deliveryFee && fCurrency(deliveryFee)}
                  </TableCell>
                </StyledRowResult>

                <StyledRowResult>
                  <TableCell colSpan={4} />

                  <TableCell align="right" sx={{ typography: 'h6' }}>
                    Tổng tiền
                  </TableCell>

                  <TableCell align="right" width={140} sx={{ typography: 'h6' }}>
                    {fCurrency(totalPrice + deliveryFee)}
                  </TableCell>
                </StyledRowResult>
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <Divider sx={{ mt: 5 }} />

        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }} />

          <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
            <Typography variant="subtitle2">Bạn cần trợ giúp?</Typography>

            <Typography variant="body2">Vui lòng liên hệ: bookstore.cn19clcb@gmail.com</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}
