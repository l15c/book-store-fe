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
        title="Billing Address"
        action={
          <Button size="small" startIcon={<Iconify icon="eva:edit-fill" />} onClick={onBackStep}>
            Edit
          </Button>
        }
      />
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          {billing?.receiver}&nbsp;
          <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
            ({billing?.title})
          </Typography>
        </Typography>

        <Typography variant="body2" gutterBottom>
          {billing?.displayAddress}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {billing?.phone}
        </Typography>
      </CardContent>
    </Card>
  );
}
