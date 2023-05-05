// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_ADMIN } from 'src/routes/paths';
// _mock_
import { _invoices } from 'src/_mock/arrays';
// layouts
import AdminLayout from 'src/layouts/admin';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// sections
import InvoiceDetails from 'src/sections/@admin/invoice/details';

// ----------------------------------------------------------------------

InvoiceDetailsPage.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;

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
        <title> Invoice: View | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Invoice Details"
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            {
              name: 'Invoices',
              href: PATH_ADMIN.invoice.root,
            },
            { name: `INV-${currentInvoice?.invoiceNumber}` },
          ]}
        />

        <InvoiceDetails invoice={currentInvoice} />
      </Container>
    </>
  );
}
