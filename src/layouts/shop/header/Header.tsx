import Link from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Stack, AppBar, Toolbar } from '@mui/material';
// utils
import { bgBlur } from 'src/utils/cssStyles';
// import useOffSetTop from 'src/hooks/useOffSetTop';
import useResponsive from 'src/hooks/useResponsive';
// config
import { HEADER } from 'src/config-global';
// components
// import Logo from 'src/components/logo/BookShop';
//
import { ShopProductSearch } from 'src/sections/@shop/e-commerce/shop';
import AccountPopover from './AccountPopover';
import CartPopover from './CartPopover';
import LogoAnimate from './LogoAnimate';

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();

  const isDesktop = useResponsive('up', 'lg');

  // const isOffset = useOffSetTop(HEADER.H_DESKTOP);

  const renderContent = (
    <Stack
      width={1}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      position="relative"
    >
      <Stack component={Link} href="/">
        <LogoAnimate />
      </Stack>

      <Stack
        flexGrow={1}
        maxWidth={480}
        mx={2}
        {...(isDesktop && {
          sx: { position: 'absolute', width: 480, left: '50%', transform: 'translateX(-50%)' },
        })}
      >
        <ShopProductSearch />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1.5 }}
      >
        <CartPopover />

        <AccountPopover />
      </Stack>
    </Stack>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        width: 1,
        zIndex: theme.zIndex.appBar + 1,
        borderBottom: `solid 1px ${theme.palette.divider}`,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(isDesktop && {
          height: HEADER.H_DESKTOP,
          // ...(isOffset && {
          //   height: HEADER.H_DESKTOP_OFFSET,
          // }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
