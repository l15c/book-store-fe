import { useState } from 'react';
// next
import Head from 'next/head';
// @mui
import { Tab, Card, Tabs, Container, Box } from '@mui/material';
// routes
import { PATH_ADMIN } from 'src/routes/paths';
// auth
import { useAuthContext } from 'src/auth/useAuthContext';
// _mock_
import {
  _userAbout,
  _userFeeds,
  _userFriends,
  _userGallery,
  _userFollowers,
} from 'src/_mock/arrays';
// layouts
import AdminLayout from 'src/layouts/admin';
// components
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
// sections
import {
  Profile,
  ProfileCover,
  ProfileFriends,
  ProfileGallery,
  ProfileFollowers,
} from 'src/sections/@admin/user/profile';

// ----------------------------------------------------------------------

UserProfilePage.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const { themeStretch } = useSettingsContext();

  const { user } = useAuthContext();

  const [searchFriends, setSearchFriends] = useState('');

  const [currentTab, setCurrentTab] = useState('profile');

  const TABS = [
    {
      value: 'profile',
      label: 'Profile',
      icon: <Iconify icon="ic:round-account-box" />,
      component: <Profile info={_userAbout} posts={_userFeeds} />,
    },
    {
      value: 'followers',
      label: 'Followers',
      icon: <Iconify icon="eva:heart-fill" />,
      component: <ProfileFollowers followers={_userFollowers} />,
    },
    {
      value: 'friends',
      label: 'Friends',
      icon: <Iconify icon="eva:people-fill" />,
      component: (
        <ProfileFriends
          friends={_userFriends}
          searchFriends={searchFriends}
          onSearchFriends={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSearchFriends(event.target.value)
          }
        />
      ),
    },
    {
      value: 'gallery',
      label: 'Gallery',
      icon: <Iconify icon="ic:round-perm-media" />,
      component: <ProfileGallery gallery={_userGallery} />,
    },
  ];

  return (
    <>
      <Head>
        <title> User: Profile | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Profile"
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            { name: 'User', href: PATH_ADMIN.user.root },
            { name: user?.fullName },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <ProfileCover
            name={user?.fullName ?? ''}
            role={_userAbout.role}
            cover={_userAbout.cover}
          />

          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              position: 'absolute',
              bgcolor: 'background.paper',
              '& .MuiTabs-flexContainer': {
                pr: { md: 3 },
                justifyContent: {
                  sm: 'center',
                  md: 'flex-end',
                },
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Card>

        {TABS.map(
          (tab) => tab.value === currentTab && <Box key={tab.value}> {tab.component} </Box>
        )}
      </Container>
    </>
  );
}
