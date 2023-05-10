import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// @mui
import { Button, Card, Grid, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import addressApi from 'src/api-client/address';
// @types
import { IUserAddress } from 'src/@types/user';
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
  onCreateBilling: (address: IUserAddress) => void;
};

export default function CheckoutBillingAddress({ onBackStep, onCreateBilling }: Props) {
  const [open, setOpen] = useState(false);

  const { data = [], isFetching } = useQuery({
    queryKey: ['user', 'address'],
    queryFn: () => addressApi.getList(),
    staleTime: Infinity,
  });

  const isEmpty = data.length === 0;

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
              color="inherit"
              onClick={onBackStep}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              sx={{ px: 2 }}
            >
              Quay lại
            </Button>

            <Button
              variant="soft"
              onClick={handleOpen}
              startIcon={<Iconify icon="eva:plus-fill" />}
              sx={{ px: 2 }}
            >
              Thêm địa chỉ
            </Button>
          </Stack>

          {isFetching ? (
            Array(3)
              .fill(0)
              .map((e, idx) => <AddressItemSkeletion key={idx} />)
          ) : (
            <>
              {isEmpty ? (
                <Card>
                  <EmptyContent
                    title=""
                    description="Có vẻ bạn chưa có địa chỉ nhận hàng. Vui lòng thêm một địa chỉ mới."
                    sx={{ height: 320 }}
                  />
                </Card>
              ) : (
                data.map((address) => (
                  <AddressItem
                    key={address.id}
                    address={address}
                    onCreateBilling={() => onCreateBilling(address)}
                  />
                ))
              )}
            </>
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
  address: IUserAddress;
  onCreateBilling: VoidFunction;
};

function AddressItem({ address, onCreateBilling }: AddressItemProps) {
  const { receiver, displayAddress, phone, isDefault } = address;

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

          <Typography variant="body2">{displayAddress}</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {phone}
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
          <Button
            variant="text"
            size="small"
            sx={{ maxWidth: 120, px: 2 }}
            onClick={onCreateBilling}
          >
            Chọn địa chỉ
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

function AddressItemSkeletion() {
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
            <Typography variant="subtitle1" width={200}>
              <Skeleton />
            </Typography>
          </Stack>

          <Typography variant="body2">
            <Skeleton width="60%" />
          </Typography>

          <Typography variant="body2">
            <Skeleton width="40%" />
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
