// import { useEffect, useState } from 'react';
// next
import Head from 'next/head';
// import { useRouter } from 'next/router';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  // Tab,
  // Tabs,
  // Card,
  Grid,
  // Divider,
  Container,
  Typography,
  Stack,
} from '@mui/material';
// redux
// import { addToCart, gotoStep } from 'src/redux/slices/checkout';
// @types
// import { ICheckoutCartItem } from 'src/@types/product';
// layouts
import ShopLayout from 'src/layouts/shop';
// components
import Iconify from 'src/components/iconify';
// import Markdown from 'src/components/markdown';
import { useSettingsContext } from 'src/components/settings';
import { SkeletonProductDetails } from 'src/components/skeleton';
// sections
import {
  // ProductDetailsSummary,
  // ProductDetailsReview,
  ProductDetailsCarousel,
} from 'src/sections/@shop/e-commerce/details';
import bookApi from 'src/api-client/book';
import { GetStaticPaths, GetStaticProps } from 'next';
// import axiosInstance from 'src/api-client/axios';
import { ParsedUrlQuery } from 'querystring';
import { IBook } from 'src/@types/book';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: '100% Original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'ic:round-verified',
  },
  {
    title: '10 Day Replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'eva:clock-fill',
  },
  {
    title: 'Year Warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'ic:round-verified-user',
  },
];

// ----------------------------------------------------------------------

ProductDetailsPage.getLayout = (page: React.ReactElement) => <ShopLayout noAuth>{page}</ShopLayout>;

// ----------------------------------------------------------------------

const ENDPOINT = process.env.HOST_API_URL ?? '';

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await bookApi.getSlugs({ baseURL: `${ENDPOINT}/api` });
  const slugs = res ?? [];
  const paths = slugs.map((slug) => ({
    params: { slug },
  }));

  return { paths, fallback: 'blocking' };
};

interface IParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const { slug } = context.params as IParams;
    const book = await bookApi.getBySlug(slug, { baseURL: `${ENDPOINT}/api` });

    if (!book)
      return {
        notFound: true,
      };
    return {
      props: {
        book,
      },
      revalidate: 60 * 15,
    };
  } catch (err) {
    console.log(`Failed to fetch posts, received status ${err?.status}`);
    return {
      notFound: true,
    };
  }
};

// ----------------------------------------------------------------------

type Props = {
  book: IBook;
};
export default function ProductDetailsPage({ book }: Props) {
  const { themeStretch } = useSettingsContext();

  // const [currentTab, setCurrentTab] = useState('description');

  // const handleAddCart = (newProduct: ICheckoutCartItem) => {
  //   dispatch(addToCart(newProduct));
  // };

  // const handleGotoStep = (step: number) => {
  //   dispatch(gotoStep(step));
  // };

  // const TABS = [
  // {
  //   value: 'description',
  //   label: 'description',
  //   component: product ? <Markdown children={product?.description} /> : null,
  // },
  // {
  //   value: 'reviews',
  //   label: `Reviews (${product ? product.reviews.length : ''})`,
  //   component: product ? <ProductDetailsReview product={product} /> : null,
  // },
  // ];
  return (
    <>
      <Head>
        <title>{`${book?.name || ''} | Book Shop`}</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        {book ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={7}>
                <ProductDetailsCarousel book={book} />
              </Grid>

              <Grid item xs={12} md={6} lg={5}>
                {/* <ProductDetailsSummary
                product={data}
                cart={checkout.cart}
                onAddCart={handleAddCart}
                onGotoStep={handleGotoStep}
              /> */}
              </Grid>
            </Grid>

            <Box
              gap={5}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
              sx={{ my: 10 }}
            >
              {SUMMARY.map((item) => (
                <Box key={item.title} sx={{ textAlign: 'center' }}>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      width: 64,
                      height: 64,
                      mx: 'auto',
                      borderRadius: '50%',
                      color: 'primary.main',
                      bgcolor: (theme) => `${alpha(theme.palette.primary.main, 0.08)}`,
                    }}
                  >
                    <Iconify icon={item.icon} width={36} />
                  </Stack>

                  <Typography variant="h6" sx={{ mb: 1, mt: 3 }}>
                    {item.title}
                  </Typography>

                  <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                </Box>
              ))}
            </Box>

            {/* <Card>
            <Tabs
              value={currentTab}
              onChange={(event, newValue) => setCurrentTab(newValue)}
              sx={{ px: 3, bgcolor: 'background.neutral' }}
            >
              {TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} label={tab.label} />
              ))}
            </Tabs>

            <Divider />

            {TABS.map(
              (tab) =>
                tab.value === currentTab && (
                  <Box
                    key={tab.value}
                    sx={{
                      ...(currentTab === 'description' && {
                        p: 3,
                      }),
                    }}
                  >
                    {tab.component}
                  </Box>
                )
            )}
          </Card> */}
          </>
        ) : (
          <SkeletonProductDetails />
        )}
      </Container>
    </>
  );
}
