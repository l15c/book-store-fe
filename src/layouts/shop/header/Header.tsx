// @mui
import { useTheme } from '@mui/material/styles';
import { Stack, AppBar, Toolbar } from '@mui/material';
// utils
import { bgBlur } from 'src/utils/cssStyles';
import useOffSetTop from 'src/hooks/useOffSetTop';
import useResponsive from 'src/hooks/useResponsive';
// config
import { HEADER } from 'src/config-global';
// components
import Logo from 'src/components/logo/BookShop';
//
import { ShopProductSearch } from 'src/sections/@shop/e-commerce/shop';
import AccountPopover from './AccountPopover';
import CartPopover from './CartPopover';

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();

  const isDesktop = useResponsive('up', 'lg');

  const isOffset = useOffSetTop(HEADER.H_DESKTOP);

  const renderContent = (
    <Stack width={1} direction="row" alignItems="center" justifyContent="space-between">
      <Logo sx={{ mr: 2.5 }} />

      <Stack flexGrow={1} maxWidth={480} mx={2}>
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
          ...(isOffset && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
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
