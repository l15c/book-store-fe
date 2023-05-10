// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_SHOP } from 'src/routes/paths';
// _mock_
import { _invoices } from 'src/_mock/arrays';
// layouts
import ShopLayout from 'src/layouts/shop';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// sections
import InvoiceDetails from 'src/sections/@admin/invoice/details';

// ----------------------------------------------------------------------

InvoiceDetailsPage.getLayout = (page: React.ReactElement) => <ShopLayout>{page}</ShopLayout>;

// ----------------------------------------------------------------------

export default function InvoiceDetailsPage() {
  const { themeStretch } = useSettingsContext();

  const {
    query: { id },
  } = useRouter();

  const currentInvoice = _invoices.find((invoice) => invoice.id === id);

  return (
    <>
      <Head>
        <title>Chi tiết đơn hàng | Book Store</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          links={[
            { name: 'Trang chủ', href: PATH_SHOP.root },
            {
              name: 'Danh sách đơn hàng',
              href: PATH_SHOP.order.root,
            },
            { name: `INV-${currentInvoice?.invoiceNumber}` },
          ]}
        />

        <InvoiceDetails invoice={currentInvoice} />
      </Container>
    </>
  );
}
