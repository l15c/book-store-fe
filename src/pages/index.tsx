// next
import { GetStaticProps } from 'next';
import Head from 'next/head';
// @mui
import { Box } from '@mui/material';
// api
import bookApi from 'src/api-client/book';
import { IAds, adsApi } from 'src/api-client/ads';
import { IBookCompact } from 'src/@types/book';
// layouts
import ShopLayout from 'src/layouts/shop';
// components
import ScrollProgress from 'src/components/scroll-progress';
// sections
import {
  HomeHero,
  HomeTopTrending,
  HomeDarkMode,
  HomeLookingFor,
  HomeForDesigner,
  HomeColorPresets,
  HomePricingPlans,
  HomeAdvertisement,
  HomeCleanInterfaces,
  HomeHugePackElements,
  HomeF,
} from '../sections/home';

// ----------------------------------------------------------------------

HomePage.getLayout = (page: React.ReactElement) => <ShopLayout noAuth> {page} </ShopLayout>;

const ENDPOINT = process.env.HOST_API_URL ?? '';

export const getStaticProps: GetStaticProps = async () => {
  try {
    const ads = await adsApi.getList({ baseURL: `${ENDPOINT}/api` });
    const bestSeller = await bookApi.bestSeller({ baseURL: `${ENDPOINT}/api` });
    const bestDiscount = await bookApi.bestDiscount({ baseURL: `${ENDPOINT}/api` });
    const newest = await bookApi.newest({ baseURL: `${ENDPOINT}/api` });
    const upComing = await bookApi.upComing({ baseURL: `${ENDPOINT}/api` });
    const random = await bookApi.random({ baseURL: `${ENDPOINT}/api` });

    return {
      props: {
        ads,
        bestDiscount,
        bestSeller,
        newest,
        upComing,
        random,
      },
      revalidate: 1,
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
  ads: IAds[];
  bestSeller: IBookCompact[];
  bestDiscount: IBookCompact[];
  newest: IBookCompact[];
  upComing: IBookCompact[];
  random: IBookCompact[];
};
export default function HomePage({
  ads,
  bestSeller,
  bestDiscount,
  newest,
  upComing,
  random,
}: Props) {
  return (
    <>
      <Head>
        <title>Book Store</title>
      </Head>

      <ScrollProgress />

      <HomeHero data={ads} />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          top: 0,
          right: 0,
          bgcolor: 'background.default',
        }}
      >
        <HomeTopTrending data={bestSeller} />

        <HomeF data={bestDiscount} />

        <HomeHugePackElements data={newest} />

        {/* <HomeForDesigner />

        <HomeDarkMode />

        <HomeColorPresets />

        <HomeCleanInterfaces />

        <HomePricingPlans />

        <HomeLookingFor />

        <HomeAdvertisement /> */}
      </Box>
    </>
  );
}
