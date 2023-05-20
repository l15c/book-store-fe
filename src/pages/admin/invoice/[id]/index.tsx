// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_ADMIN } from 'src/routes/paths';
// layouts
import AdminLayout from 'src/layouts/admin';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// sections
import InvoiceDetails from 'src/sections/@admin/invoice/details';
import { useQuery } from '@tanstack/react-query';
import orderApi from 'src/api-client/order';
import { LoadingLinear } from 'src/components/loading-screen/LoadingScreen';

// ----------------------------------------------------------------------

InvoiceDetailsPage.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;

// ----------------------------------------------------------------------

export default function InvoiceDetailsPage() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { id },
  } = useRouter();

  const { data, isFetching } = useQuery({
    queryKey: ['user', 'orders', id],
    queryFn: () => orderApi.getById(id as string),
    enabled: !!id,
  });

  return (
    <>
      <Head>
        <title>Chi tiết đơn hàng | Book Store</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        {isFetching && <LoadingLinear />}
        <CustomBreadcrumbs
          heading="Invoice Details"
          links={[
            { name: 'Trang chủ', href: PATH_ADMIN.root },
            {
              name: 'Danh sách đơn hàng',
              href: PATH_ADMIN.invoice.root,
            },
            { name: `${data?.id ?? ''}` },
          ]}
        />

        <InvoiceDetails order={data} />
      </Container>
    </>
  );
}
