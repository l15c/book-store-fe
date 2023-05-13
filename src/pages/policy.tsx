// next
import Head from 'next/head';
// @mui
import { Box, Container, Typography } from '@mui/material';
// layouts
import ShopLayout from 'src/layouts/shop/ShopLayout';
// sections
import { FaqsHero, FaqsCategory, FaqsList, FaqsForm } from 'src/sections/faqs';

// ----------------------------------------------------------------------

FaqsPage.getLayout = (page: React.ReactElement) => <ShopLayout noAuth>{page}</ShopLayout>;

// ----------------------------------------------------------------------

export default function FaqsPage() {
  return (
    <>
      <Head>
        <title> Hỗ trợ | Book Store</title>
      </Head>

      <FaqsHero />

      <Container sx={{ pt: 15, pb: 10, position: 'relative' }}>
        <FaqsCategory />

        {/* <Typography variant="h3" sx={{ mb: 5 }}>
          Frequently asked questions
        </Typography> */}
        <FaqsList />
        {/* <Box
          gap={10}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >


          <FaqsForm />
        </Box> */}
      </Container>
    </>
  );
}
