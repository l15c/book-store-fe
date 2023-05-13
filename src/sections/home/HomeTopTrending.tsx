import Link from 'next/link';
import { m } from 'framer-motion';
// @type
import { IBookCompact } from 'src/@types/book';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Container, Typography, Stack } from '@mui/material';
// hook
import useResponsive from 'src/hooks/useResponsive';
// components
import Image from '../../components/image';
import { MotionViewport, varFade } from '../../components/animate';
// utils
import { getUrlImage } from '../../utils/cloudinary';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(3, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8, 0),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: 8,
}));

// ----------------------------------------------------------------------
type Props = {
  data: IBookCompact[];
};

export default function HomeTopTrending({ data }: Props) {
  const isMobile = useResponsive('down', 'md');
  return (
    <StyledRoot>
      <Container component={MotionViewport}>
        <Stack
          spacing={5}
          sx={{
            textAlign: 'center',
            mb: 4,
          }}
        >
          <m.div variants={varFade().inUp}>
            <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
              BOOK STORE
            </Typography>
          </m.div>

          <m.div variants={varFade().inDown}>
            <Typography variant="h2">Xu hướng</Typography>
          </m.div>
        </Stack>

        <Box
          gap={{ xs: 3, lg: 5 }}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          }}
        >
          {data.slice(0, 4).map((book) => (
            <m.div
              variants={varFade().inUp}
              key={book.id}
              {...(!isMobile && {
                whileHover: {
                  scale: 1.1,
                },
              })}
            >
              <StyledCard
                sx={{
                  cursor: 'pointer',
                  boxShadow: (theme) => theme.shadows[24],
                }}
              >
                <Link href={`/products/${book.slug}`}>
                  <Image
                    alt={book.name}
                    src={getUrlImage.product(book.cover, book.slug)}
                    ratio="4/6"
                  />
                </Link>
              </StyledCard>
            </m.div>
          ))}
        </Box>
      </Container>
    </StyledRoot>
  );
}
