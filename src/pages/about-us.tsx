// next
import Head from 'next/head';
// layouts
import ShopLayout from 'src/layouts/shop/ShopLayout';
// sections
import AboutMap from 'src/sections/about/AboutMap';
import { AboutHero, AboutWhat } from '../sections/about';

// ----------------------------------------------------------------------

AboutPage.getLayout = (page: React.ReactElement) => <ShopLayout noAuth>{page}</ShopLayout>;

// ----------------------------------------------------------------------

export default function AboutPage() {
  return (
    <>
      <Head>
        <title> Về chúng tôi | Book Store</title>
      </Head>

      <AboutHero />

      <AboutWhat />

      <AboutMap />

      {/* <AboutVision />

      <Divider orientation="vertical" sx={{ my: 10, mx: 'auto', width: 2, height: 40 }} />

      <AboutTestimonials /> */}
    </>
  );
}
