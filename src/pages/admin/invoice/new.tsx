// next
import Head from 'next/head';
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
import InvoiceNewEditForm from 'src/sections/@admin/invoice/form';

// ----------------------------------------------------------------------

InvoiceCreatePage.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;

// ----------------------------------------------------------------------

export default function InvoiceCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> Invoices: Create a new invoice | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new invoice"
          links={[
            {
              name: 'Dashboard',
              href: PATH_ADMIN.root,
            },
            {
              name: 'Invoices',
              href: PATH_ADMIN.invoice.list,
            },
            {
              name: 'New invoice',
            },
          ]}
        />

        <InvoiceNewEditForm />
      </Container>
    </>
  );
}
