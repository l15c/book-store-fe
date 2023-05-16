// @mui
import { Grid, Stack } from '@mui/material';

//
import AccountBillingAddress from '../AccountBillingAddress';

// ----------------------------------------------------------------------

export default function AccountBilling() {
  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <AccountBillingAddress />
        </Stack>
      </Grid>

      <Grid item xs={12} md={4}>
        {/* <AccountBillingInvoiceHistory invoices={[]} /> */}
      </Grid>
    </Grid>
  );
}
