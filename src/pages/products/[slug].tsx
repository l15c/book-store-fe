// next
import Head from 'next/head';
import { useState, useEffect, useMemo, useRef } from 'react';
// @mui
import { Box, Tab, Tabs, Card, Grid, Divider, Container } from '@mui/material';
// redux
import { gotoStep } from 'src/redux/slices/checkout';
// @types
import { IBook, IBookCompact, ICartItem } from 'src/@types/book';
// layouts
import ShopLayout from 'src/layouts/shop';
// components
import Markdown from 'src/components/markdown';
import { useSettingsContext } from 'src/components/settings';
import { SkeletonProductDetails } from 'src/components/skeleton';
// sections
import {
  ProductDetailsSummary,
  ProductDetailsReview,
  ProductDetailsCarousel,
  ProductDetailsRelated,
} from 'src/sections/@shop/e-commerce/details';
import bookApi from 'src/api-client/book';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { useDispatch, useSelector } from 'src/redux/store';
import { addToCart } from 'src/redux/slices/cart';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

// ----------------------------------------------------------------------

// const SUMMARY = [
//   {
//     title: '100% Original',
//     description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
//     icon: 'ic:round-verified',
//   },
//   {
//     title: '10 Day Replacement',
//     description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
//     icon: 'eva:clock-fill',
//   },
//   {
//     title: 'Year Warranty',
//     description: 'Cotton candy gingerbread cake I love sugar sweet.',
//     icon: 'ic:round-verified-user',
//   },
// ];

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
    const booksRelated = await bookApi.related(book.id, { baseURL: `${ENDPOINT}/api` });
    if (!book)
      return {
        notFound: true,
      };
    return {
      props: {
        book,
        booksRelated,
      },
      revalidate: 60 * 15,
    };
  } catch (err) {
    console.log(err);
    console.log(`Failed to fetch posts, received status ${err?.status}`);
    return {
      notFound: true,
    };
  }
};

// ----------------------------------------------------------------------

type Props = {
  book: IBook;
  booksRelated: IBookCompact[];
};

export default function ProductDetailsPage({ book: _book, booksRelated }: Props) {
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const { asPath } = useRouter();

  const { data: book, isFetching } = useQuery({
    initialData: _book,
    queryKey: ['products', _book.slug],
    queryFn: () => bookApi.getBySlug(_book.slug),
    keepPreviousData: true,
  });

  const cart = useSelector((e) => e.cart);

  const handleAddCart = (product: ICartItem) => {
    dispatch(addToCart(product, cart.products, !!user));
  };

  const handleGotoStep = (step: number) => {
    dispatch(gotoStep(step));
  };

  const firstUpdate = useRef(true);
  const [currentTab, setCurrentTab] = useState('description');
  const [triggerScroll, setTriggerScroll] = useState(false);

  const TABS = useMemo(
    () => [
      {
        value: 'description',
        label: 'Thông tin sản phẩm',
        component: <Markdown children={book?.description || ''} />,
      },
      {
        value: 'review',
        label: `Đánh giá (${(book?.review || []).length})`,
        component: <ProductDetailsReview book={book} />,
      },
    ],
    [book]
  );

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      const ele = document.getElementById(currentTab);
      if (ele) ele.scrollIntoView(true);
    }
  }, [TABS, currentTab, triggerScroll]);

  useEffect(
    () => () => {
      firstUpdate.current = true;
    },
    [asPath]
  );

  return (
    <>
      <Head>
        <title>{`${book?.name || ''} | Book Store`}</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'} sx={{ px: { xs: 0, md: 2 } }}>
        {!isFetching || book ? (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ProductDetailsCarousel book={book} />
              </Grid>

              <Grid item xs={12} md={6}>
                <ProductDetailsSummary
                  book={book}
                  cart={cart.products}
                  onAddCart={handleAddCart}
                  onGotoStep={handleGotoStep}
                  scrollToTab={() => {
                    setCurrentTab('review');
                    setTriggerScroll((prev) => !prev);
                  }}
                />
              </Grid>
            </Grid>

            <ProductDetailsRelated books={booksRelated} />

            <Card sx={{ my: 8 }}>
              <Tabs
                visibleScrollbar
                value={currentTab}
                onChange={(event, newValue) => {
                  setCurrentTab(newValue);
                  setTriggerScroll((p) => !p);
                }}
                sx={{ px: 3, bgcolor: 'background.neutral' }}
              >
                {TABS.map((tab) => (
                  <Tab key={tab.value} value={tab.value} label={tab.label} />
                ))}
              </Tabs>

              <Divider />

              {TABS.map((tab) => (
                <Box
                  id={tab.value}
                  key={tab.value}
                  sx={{
                    display: tab.value === currentTab ? 'block' : 'none',
                    pt: 10,
                    mt: -10,
                    ...(currentTab === 'description' && {
                      p: 3,
                      mt: 0,
                    }),
                  }}
                >
                  {tab.component}
                </Box>
              ))}
            </Card>
          </>
        ) : (
          <SkeletonProductDetails />
        )}
      </Container>
    </>
  );
}
