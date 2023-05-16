import { useEffect, useState } from 'react';
// next
import Head from 'next/head';
// @mui
import { Box, Container, Tab, Tabs } from '@mui/material';
// layouts
import ShopLayout from 'src/layouts/shop/ShopLayout';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
// sections
import { useRouter } from 'next/router';
import {
  AccountBilling,
  AccountChangePassword,
  AccountGeneral,
} from 'src/sections/@shop/user/account';

// ----------------------------------------------------------------------

UserAccountPage.getLayout = (page: React.ReactElement) => <ShopLayout>{page}</ShopLayout>;

// ----------------------------------------------------------------------

export default function UserAccountPage() {
  const { asPath, replace } = useRouter();

  const { themeStretch } = useSettingsContext();

  const TABS = [
    {
      value: 'general',
      label: 'Tổng quan',
      icon: <Iconify icon="ic:round-account-box" />,
      component: <AccountGeneral />,
    },
    {
      value: 'address',
      label: 'Địa chỉ',
      icon: <Iconify icon="ic:round-receipt" />,
      component: <AccountBilling />,
    },
    // {
    //   value: 'notifications',
    //   label: 'Notifications',
    //   icon: <Iconify icon="eva:bell-fill" />,
    //   component: <AccountNotifications />,
    // },
    // {
    //   value: 'social_links',
    //   label: 'Social links',
    //   icon: <Iconify icon="eva:share-fill" />,
    //   component: <AccountSocialLinks socialLinks={_userAbout.socialLinks} />,
    // },
    {
      value: 'change-password',
      label: 'Đổi mật khẩu',
      icon: <Iconify icon="ic:round-vpn-key" />,
      component: <AccountChangePassword />,
    },
  ];

  const [currentTab, setCurrentTab] = useState('general');

  useEffect(() => {
    const tab = asPath.split('#').pop() ?? '';
    if (TABS.map((e) => e.value).includes(tab)) {
      setCurrentTab(tab);
      replace('/account', undefined, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TABS, asPath]);

  return (
    <>
      <Head>
        <title> Tài khoản | Book Store</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Container>
    </>
  );
}
