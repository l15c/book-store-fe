// next
import NextLink from 'next/link';
// @mui
import { Box, Grid, Link, Stack, Divider, Container, Typography, IconButton } from '@mui/material';
import { LogoOnly } from 'src/components/logo/BookShop';
// routes
import { PATH_PAGE } from '../../routes/paths';
// _mock
import { _socials } from '../../_mock/arrays';
// components
import Logo from '../../components/logo';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'Giới thiệu',
    children: [
      { name: 'Về chúng tôi', href: PATH_PAGE.about },
      //   { name: 'Liên lạc với chúng tôi', href: '#' },
      //   { name: 'FAQs', href: PATH_PAGE.faqs },
    ],
  },
  {
    headline: 'Hỗ trợ',
    children: [
      { name: 'Chính sách đổi trả', href: PATH_PAGE.policy },
      //   { name: '...', href: '#' },
    ],
  },
  {
    headline: 'Liên hệ',
    children: [
      { name: 'Hotline: 0966 521 770', href: 'tel:+84966521770' },
      { name: 'bookstore.cn19clcb@gmail.com', href: 'mailto:bookstore.cn19clcb@gmail.com' },
      { name: 'Số 2 đường Võ Oanh, P.25, Q.Bình Thạnh', href: '#' },
    ],
  },
];

// ----------------------------------------------------------------------

export default function Footer() {
  const mainFooter = (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Divider />

      <Container sx={{ py: 3 }}>
        <Grid
          container
          justifyContent={{
            xs: 'center',
            md: 'space-between',
          }}
          sx={{
            textAlign: {
              xs: 'center',
              md: 'left',
            },
          }}
        >
          <Grid item xs={12}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Logo
                sx={{
                  mx: { xs: 'auto', md: 'inherit' },
                  width: 64,
                  height: 64,
                  transform: 'rotate(180deg)',
                }}
              />
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <LogoOnly />
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={8} md={4}>
            <Typography variant="body2" sx={{ pr: { md: 5 } }}>
              Book Store là một đơn cung cấp sỉ và lẻ với đa dạng các đầu sách thuộc nhiều thể loại
              bao gồm cả sách quốc văn và ngoại văn.
            </Typography>

            <Stack
              spacing={1}
              direction="row"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{
                mt: 5,
                mb: { xs: 5, md: 0 },
              }}
            >
              {_socials.map((social) => (
                <IconButton key={social.name}>
                  <Iconify icon={social.icon} />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              justifyContent="space-between"
              direction={{ xs: 'column', md: 'row' }}
            >
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  alignItems={{ xs: 'center', md: 'flex-start' }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={NextLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* <Typography
          variant="caption"
          component="div"
          sx={{
            mt: 10,
            pb: 5,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          © 2021. All rights reserved
        </Typography> */}
      </Container>
    </Box>
  );

  return mainFooter;
}
