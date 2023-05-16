import { useState } from 'react';
// @mui
import { Box, Card, Button, Typography, Stack, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// @types
import { IUserAddress } from 'src/@types/user';
// components
import Iconify from 'src/components/iconify';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import addressApi from 'src/api-client/address';
import Label from 'src/components/label/Label';
import { LoadingLinear } from 'src/components/loading-screen/LoadingScreen';
import AddressNewEditForm from '../AddressNewEditForm';

// ----------------------------------------------------------------------

export default function AccountBillingAddress() {
  const [addressEdit, setAddressEdit] = useState<IUserAddress>();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data = [], isFetching } = useQuery({
    queryKey: ['user', 'address'],
    queryFn: () => addressApi.getList(),
  });

  const handleUpdate = (address: IUserAddress) => {};

  const handleDelete = async (id: number) => {
    await addressApi.delete(id);
    await queryClient.invalidateQueries({
      queryKey: ['user', 'address'],
      refetchType: 'all',
    });
  };
  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Địa chỉ đặt hàng
          </Typography>

          <Button
            variant="soft"
            size="small"
            startIcon={<Iconify icon="eva:plus-fill" />}
            sx={{ px: 2 }}
            onClick={() => setOpen(true)}
          >
            Thêm địa chỉ
          </Button>
        </Stack>

        {isFetching ? (
          <LoadingLinear enableScroll sx={{ position: 'unset', height: 240 }} />
        ) : (
          <Stack spacing={2} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
            {data.map((address) => (
              <AddressItem
                key={address.id}
                address={address}
                onDelete={handleDelete}
                onEdit={() => {
                  setAddressEdit(address);
                  setOpen(true);
                }}
              />
            ))}
          </Stack>
        )}
      </Card>
      {open && (
        <AddressNewEditForm
          open={open}
          isEdit={!!addressEdit}
          addressCurrent={addressEdit}
          onClose={() => {
            setOpen(false);
            setAddressEdit(undefined);
          }}
          onSubmit={handleUpdate}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type AddressItemProps = {
  address: IUserAddress;
  onDelete: (id: number) => void;
  onEdit: () => void;
};

function AddressItem({ address, onDelete, onEdit }: AddressItemProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onDelete(address.id);
    setLoading(false);
  };

  return (
    <Stack spacing={1}>
      <Stack flexGrow={1} spacing={1}>
        <Stack direction="row" alignItems="center">
          <Typography variant="subtitle1">{address.receiver}</Typography>

          {address.isDefault && (
            <Label color="info" sx={{ ml: 1 }}>
              Mặc định
            </Label>
          )}
        </Stack>

        <Typography variant="body2">
          <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
            Địa chỉ:
          </Box>
          {address.displayAddress}
        </Typography>

        <Typography variant="body2">
          <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
            Số điện thoại:
          </Box>
          {address.phone}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        {!address.isDefault && (
          <LoadingButton
            loading={loading}
            color="error"
            size="small"
            startIcon={<Iconify icon="eva:trash-2-outline" />}
            onClick={handleDelete}
          >
            Xóa địa chỉ
          </LoadingButton>
        )}

        <Button size="small" startIcon={<Iconify icon="eva:edit-fill" />} onClick={onEdit}>
          Chỉnh sửa
        </Button>
      </Stack>
    </Stack>
  );
}
