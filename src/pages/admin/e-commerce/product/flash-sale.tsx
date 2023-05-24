import { useState } from 'react';
import Head from 'next/head';
import AdminLayout from 'src/layouts/admin';
import {
  PublisherNewEditForm,
  AuthorNewEditForm,
  GenreNewEditForm,
  FlashSaleNewEditForm,
} from 'src/sections/@admin/e-commerce';
import {
  Container,
  Grid,
  Modal,
  Box,
  Autocomplete,
  TextField,
  CircularProgress,
  Stack,
  Typography,
  Button,
  Paper,
  Card,
  Dialog,
} from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useData } from 'src/hooks/data';
import Iconify from 'src/components/iconify/Iconify';
import { IAuthor, IGenre, IPublisher } from 'src/@types/book';
import { toNonAccentVietnamese as nonAccent } from 'src/utils/stringConverter';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import { PATH_ADMIN } from 'src/routes/paths';
import flashSaleApi from 'src/api-client/flash-sale';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoadingLinear } from 'src/components/loading-screen/LoadingScreen';
import { fDateTimeRange } from 'src/utils/formatTime';
import { LoadingButton } from '@mui/lab';
import { IFlashSale } from 'src/@types/flash-sale';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';

// ----------------------------------------------------------------------
ProductMoreInfoPage.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;

export default function ProductMoreInfoPage() {
  const { themeStretch } = useSettingsContext();

  const [open, setOpen] = useState(false);
  const [saleEdit, setSaleEdit] = useState<IFlashSale | null>(null);

  const { data = [], isFetching } = useQuery({
    queryKey: ['admin', 'flash-sale'],
    queryFn: () => flashSaleApi.getList(),
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Head>
        <title>Thông tin khác | Book Store</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'} sx={{ minHeight: '100vdh' }}>
        {isFetching && <LoadingLinear />}
        <CustomBreadcrumbs
          heading=""
          links={[{ name: 'Trang chủ', href: PATH_ADMIN.root }, { name: 'Flash Sale' }]}
          action={
            <Button
              variant="contained"
              onClick={() => {
                setOpen(true);
                setSaleEdit(null);
              }}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Thêm mới
            </Button>
          }
        />
        <Grid container spacing={2}>
          {data.map((sale) => (
            <Grid item key={sale.id} xs={12} sm={6} md={4}>
              <SaleItem
                sale={sale}
                onDelete={flashSaleApi.delete}
                onEdit={() => {
                  setSaleEdit(sale);
                  setOpen(true);
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
      <FlashSaleNewEditForm
        open={open}
        sale={saleEdit}
        onClose={handleClose}
        onCancel={handleClose}
      />
    </>
  );
}

type Props = {
  sale: IFlashSale;
  onDelete: Function;
  onEdit?: VoidFunction;
};
const SaleItem = ({ sale, onDelete, onEdit }: Props) => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: (id: number) => onDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'flash-sale'], refetchType: 'all' });
    },
  });

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  return (
    <Card
      sx={{
        py: 1,
        px: 2,
        '&:hover .action': {
          visibility: 'visible',
        },
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="center">
          <Typography
            variant="subtitle1"
            flexGrow={1}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
            }}
          >
            {sale.name}
          </Typography>
          <Stack
            direction="row"
            className="action"
            spacing={1}
            sx={{ visibility: 'hidden', '& .MuiButton-startIcon': { m: 0 } }}
          >
            <LoadingButton
              loading={isLoading}
              color="error"
              size="small"
              startIcon={<Iconify icon="eva:trash-2-outline" />}
              sx={{ minWidth: 'unset', px: 1, py: 2 }}
              onClick={handleOpenConfirm}
            />

            <Button
              size="small"
              startIcon={<Iconify icon="eva:edit-fill" />}
              sx={{ minWidth: 'unset', px: 1, py: 2 }}
              onClick={onEdit}
            />
          </Stack>
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            <Box component="span" sx={{ mr: 0.5 }}>
              Ghi chú:
            </Box>
            {sale.description}
          </Typography>

          <Typography variant="body2">
            <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
              Thời gian:
            </Box>
            {fDateTimeRange(sale.startDate, sale.endDate)}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Đầu sách: {sale.saleBooks.length}
          </Typography>
        </Stack>
      </Stack>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title={`Xoá ${sale.name}`}
        content="Bạn có chắc chắn muốn xóa đợt flashsale này?"
        action={
          <Button variant="contained" color="error" onClick={() => mutate(sale.id)}>
            Xóa
          </Button>
        }
      />
    </Card>
  );
};
