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
import { BlogNewPostForm } from 'src/sections/@admin/blog';

// ----------------------------------------------------------------------

BlogNewPostPage.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;

// ----------------------------------------------------------------------

export default function BlogNewPostPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> Blog: New Post | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new post"
          links={[
            {
              name: 'Dashboard',
              href: PATH_ADMIN.root,
            },
            {
              name: 'Blog',
              href: PATH_ADMIN.blog.root,
            },
            {
              name: 'Create',
            },
          ]}
        />

        <BlogNewPostForm />
      </Container>
    </>
  );
}
