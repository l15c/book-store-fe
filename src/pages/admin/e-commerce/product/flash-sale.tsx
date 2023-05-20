import { useState } from 'react';
import Head from 'next/head';
import AdminLayout from 'src/layouts/admin';
import {
  PublisherNewEditForm,
  AuthorNewEditForm,
  GenreNewEditForm,
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

// ----------------------------------------------------------------------
ProductMoreInfoPage.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;

export default function ProductMoreInfoPage() {
  const { themeStretch } = useSettingsContext();

  const [openModal, setOpenModal] = useState(false);

  // const {data} = useQuery({
  //   queryKey: ['admin', 'flash-sale'],
  //   queryFn: () => authorApi.getList(),
  //   ...commonOptions,
  // });

  return (
    <>
      <Head>
        <title>Thông tin khác | Book Store</title>
      </Head>

      <Container
        maxWidth={themeStretch ? false : 'lg'}
        sx={{ maxHeight: '100vdh', overflow: 'hidden' }}
      >
        <CustomBreadcrumbs
          heading=""
          links={[{ name: 'Trang chủ', href: PATH_ADMIN.root }, { name: 'Flash Sale' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" onClick={() => setOpenModal(true)} />}
            >
              Thêm mới
            </Button>
          }
        />
        <Grid container spacing={2} my={2}>
          <Grid item xs={12} md={6}>
            a
          </Grid>
        </Grid>

        <Modal open={!!openModal} onClose={() => setOpenModal(false)}>
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 480,
              pt: 2,
              px: 4,
              pb: 3,
            }}
          >
            a
          </Paper>
        </Modal>
      </Container>
    </>
  );
}
