import { useState } from 'react';
// @mui
import { Button, Card, Grid, IconButton, Stack, Typography } from '@mui/material';
// @types
import { ICheckoutBillingAddress } from '../../../../../@types/product';
// _mock
import { _addressBooks } from '../../../../../_mock/arrays';
// components
import EmptyContent from '../../../../../components/empty-content';
import Iconify from '../../../../../components/iconify';
import Label from '../../../../../components/label';
//
import CheckoutSummary from '../CheckoutSummary';
import CheckoutBillingNewAddressForm from './CheckoutBillingNewAddressForm';

// ----------------------------------------------------------------------

type Props = {
  onBackStep: VoidFunction;
  onCreateBilling: (address: ICheckoutBillingAddress) => void;
};

export default function CheckoutBillingAddress({ onBackStep, onCreateBilling }: Props) {
  const [open, setOpen] = useState(false);

  const isEmpty = _addressBooks.length === 0;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack direction="row" justifyContent="space-between" mb={1}>
            <Button
              size="small"
              color="inherit"
              onClick={onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              sx={{ p: 2 }}
            >
              Quay lại
            </Button>

            <Button
              size="small"
              variant="soft"
              onClick={handleOpen}
              startIcon={<Iconify icon="eva:plus-fill" />}
              sx={{ p: 2 }}
            >
              Thêm địa chỉ
            </Button>
          </Stack>

          {isEmpty ? (
            <Card>
              <EmptyContent
                title=""
                description="Có vẻ bạn chưa có địa chỉ nhận hàng. Vui lòng thêm một địa chỉ mới."
                sx={{ height: 320 }}
              />
            </Card>
          ) : (
            _addressBooks.map((address, index) => (
              <AddressItem
                key={index}
                address={address}
                onCreateBilling={() => onCreateBilling(address)}
              />
            ))
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutSummary />
        </Grid>
      </Grid>

      <CheckoutBillingNewAddressForm
        open={open}
        onClose={handleClose}
        onCreateBilling={onCreateBilling}
      />
    </>
  );
}

// ----------------------------------------------------------------------

type AddressItemProps = {
  address: ICheckoutBillingAddress;
  onCreateBilling: VoidFunction;
};

function AddressItem({ address, onCreateBilling }: AddressItemProps) {
  const { receiver, fullAddress, phoneNumber, isDefault } = address;

  return (
    <Card
      sx={{
        p: 3,
        mb: 2,
      }}
    >
      <Stack
        spacing={2}
        direction={{
          xs: 'column',
          sm: 'row',
        }}
      >
        <Stack flexGrow={1} spacing={1}>
          <Stack direction="row" alignItems="center">
            <Typography variant="subtitle1">{receiver}</Typography>

            {isDefault && (
              <Label color="info" sx={{ ml: 1 }}>
                Mặc định
              </Label>
            )}
          </Stack>

          <Typography variant="body2">{fullAddress}</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {phoneNumber}
          </Typography>
        </Stack>

        <Stack flexDirection="column" flexWrap="wrap" flexShrink={0}>
          <Stack direction="row" mb="auto" ml={{ sm: 'auto' }}>
            {!isDefault && (
              <IconButton color="error">
                <Iconify icon="eva:trash-2-outline" />
              </IconButton>
            )}
            <IconButton color="info">
              <Iconify icon="mdi:square-edit-outline" />
            </IconButton>
          </Stack>
          <Button variant="outlined" size="small" sx={{ maxWidth: 120 }} onClick={onCreateBilling}>
            Chọn địa chỉ
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
