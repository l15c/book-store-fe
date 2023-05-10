import { m } from 'framer-motion';
import { forwardRef } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { styled } from '@mui/material/styles';
import { Link, BoxProps } from '@mui/material';
import { secondaryFont } from '../../theme/typography';
// utils
import { textGradient } from '../../utils/cssStyles';
import useResponsive from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const StyledGradientText = styled(m.h3)(({ theme }) => ({
  ...textGradient(
    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
  ),
  backgroundSize: '400%',
  fontFamily: secondaryFont.style.fontFamily,
  fontSize: `2rem`,
  padding: 0,
  margin: 0,
}));

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const isMobile = useResponsive('down', 'sm');

    const logo = (
      <StyledGradientText
        animate={{ backgroundPosition: '200% center' }}
        transition={{
          repeatType: 'reverse',
          ease: 'linear',
          duration: 20,
          repeat: Infinity,
        }}
      >
        {isMobile ? 'B' : 'BOOK STORE'}
      </StyledGradientText>
    );

    if (disabledLink) {
      return <>{logo}</>;
    }

    return (
      <Link component={NextLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export const LogoOnly = () => (
  <StyledGradientText
    animate={{ backgroundPosition: '200% center' }}
    transition={{
      repeatType: 'reverse',
      ease: 'linear',
      duration: 20,
      repeat: Infinity,
    }}
  >
    BOOK STORE
  </StyledGradientText>
);

export default Logo;
