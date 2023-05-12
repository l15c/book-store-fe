import { useState } from 'react';
import { getUrlImage } from 'src/utils/cloudinary';
// next
import { useRouter } from 'next/router';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// routes
import { PATH_ADMIN, PATH_AUTH, PATH_SHOP } from '../../../routes/paths';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import { CustomAvatar } from '../../../components/custom-avatar';
import { useSnackbar } from '../../../components/snackbar';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Trang chủ',
    linkTo: '/',
  },
  {
    label: 'Đổi mật khẩu',
    linkTo: PATH_AUTH.changPassword,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { push, asPath } = useRouter();

  const { user, logout } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    if (user) {
      setOpenPopover(event.currentTarget);
    } else {
      enqueueSnackbar('Vui lòng đăng nhập', { variant: 'info' });
      push(PATH_AUTH.login, asPath);
    }
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleLogout = async () => {
    try {
      logout();
      handleClosePopover();
      enqueueSnackbar('Đã đăng xuất tài khoản', { variant: 'info' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleClickItem = (path: string) => {
    handleClosePopover();
    push(path);
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpenPopover}
        sx={{
          p: 0,
          ...(openPopover && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.3),
            },
          }),
        }}
      >
        <CustomAvatar
          src={getUrlImage.avatar(user?.imageUrl)}
          alt={user?.fullName}
          name={user?.fullName}
        />
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ p: 0, maxWidth: 320 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.fullName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {user?.roleId !== 6 && (
            <MenuItem onClick={() => handleClickItem(PATH_ADMIN.root)}>Trang quản lý</MenuItem>
          )}
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
          {user?.roleId === 6 && (
            <MenuItem onClick={() => handleClickItem(PATH_SHOP.order.root)}>Đơn hàng</MenuItem>
          )}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Đăng xuất
        </MenuItem>
      </MenuPopover>
    </>
  );
}
