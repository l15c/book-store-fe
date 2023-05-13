import { m } from 'framer-motion';
import Link from 'next/link';
// @mui
import { Button, Container, Grid, Typography } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
// hooks
import useResponsive from '../../hooks/useResponsive';
// utils
// _mock_
// components
import { MotionViewport, varFade } from '../../components/animate';
import Iconify from '../../components/iconify';
import Image from '../../components/image';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(20),
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    textAlign: 'left',
  },
}));

// ----------------------------------------------------------------------

export default function AboutWhat() {
  const theme = useTheme();

  const isDesktop = useResponsive('up', 'md');

  const isLight = theme.palette.mode === 'light';

  const shadow = `-40px 40px 80px ${alpha(
    isLight ? theme.palette.grey[500] : theme.palette.common.black,
    0.48
  )}`;

  return (
    <StyledRoot>
      <Container component={MotionViewport}>
        <Grid container spacing={3}>
          {isDesktop && (
            <Grid item xs={12} md={6} lg={7} sx={{ pr: { md: 7 } }}>
              <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={6}>
                  <m.div variants={varFade().inUp}>
                    <Image
                      alt="our office 1"
                      src="/assets/images/about/what_1.jpg"
                      ratio="3/4"
                      sx={{
                        borderRadius: 2,
                        boxShadow: shadow,
                      }}
                    />
                  </m.div>
                </Grid>
                <Grid item xs={6}>
                  <m.div variants={varFade().inUp}>
                    <Image
                      alt="our office 2"
                      src="/assets/images/about/what_2.jpg"
                      ratio="1/1"
                      sx={{ borderRadius: 2 }}
                    />
                  </m.div>
                </Grid>
              </Grid>
            </Grid>
          )}

          <Grid item xs={12} md={6} lg={5}>
            <m.div variants={varFade().inRight}>
              <Typography variant="h2" sx={{ mb: 3 }}>
                Về Book Store
              </Typography>
            </m.div>

            <m.div variants={varFade().inRight}>
              <Typography
                sx={{
                  color: theme.palette.mode === 'light' ? 'text.secondary' : 'common.white',
                }}
              >
                Book Store là một đơn cung cấp sỉ và lẻ với đa dạng các đầu sách thuộc nhiều thể
                loại bao gồm cả sách quốc văn và ngoại văn. <br />
                Sách quốc văn với nhiều thể loại đa dạng như sách giáo khoa – tham khảo, giáo trình,
                sách học ngữ, từ điển, sách tham khảo thuộc nhiều chuyên ngành phong phú: văn học,
                tâm lý – giáo dục, khoa học kỹ thuật, khoa học kinh tế - xã hội, khoa học thường
                thức, sách phong thủy, nghệ thuật sống, danh ngôn, sách thiếu nhi, truyện tranh,
                truyện đọc, từ điển, công nghệ thông tin, khoa học – kỹ thuật, nấu ăn, làm đẹp...
              </Typography>
            </m.div>

            <m.div variants={varFade().inRight}>
              <Link href="/">
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ mt: 2 }}
                  endIcon={<Iconify icon="ic:round-arrow-right-alt" width={24} />}
                >
                  Mua sắm ngay
                </Button>
              </Link>
            </m.div>
          </Grid>
        </Grid>
      </Container>
    </StyledRoot>
  );
}

// ----------------------------------------------------------------------
