// @mui
import { Box, BoxProps } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// config
import { HEADER } from '../../config-global';

// ----------------------------------------------------------------------

const SPACING = 8;

export default function Main({ children, sx, ...other }: BoxProps) {
  const isDesktop = useResponsive('up', 'lg');

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: `${HEADER.H_MOBILE + SPACING}px`,
        ...(isDesktop && {
          width: 1,
          py: `${HEADER.H_DESKTOP + SPACING}px`,
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}
