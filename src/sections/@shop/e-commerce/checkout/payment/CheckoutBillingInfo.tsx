// @mui
import { Card, Button, Typography, CardHeader, CardContent } from '@mui/material';
// @types
import { IUserAddress } from 'src/@types/user';
// components
import Iconify from '../../../../../components/iconify';

// ----------------------------------------------------------------------

type Props = {
  billing: IUserAddress | null;
  onBackStep: VoidFunction;
};

export default function CheckoutBillingInfo({ billing, onBackStep }: Props) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Thông tin nhận hàng"
        action={
          <Button size="small" startIcon={<Iconify icon="eva:edit-fill" />} onClick={onBackStep}>
            Thay đổi
          </Button>
        }
      />
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
            Người nhận:&nbsp;
          </Typography>
          {billing?.receiver}
        </Typography>

        <Typography variant="body2" gutterBottom>
          <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
            Địa chỉ:&nbsp;
          </Typography>
          {billing?.displayAddress}
        </Typography>

        <Typography variant="body2">
          <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
            Số điện thoại:&nbsp;
          </Typography>
          {billing?.phone}
        </Typography>
      </CardContent>
    </Card>
  );
}
