import orderBy from 'lodash/orderBy';
import { useEffect, useCallback, useState } from 'react';
// next
import Head from 'next/head';
import NextLink from 'next/link';
// @mui
import { Grid, Button, Container, Stack } from '@mui/material';
// utils
import axios from 'src/api-client/axios';
// routes
import { PATH_ADMIN } from 'src/routes/paths';
// @types
import { IBlogPost } from 'src/@types/blog';
// layouts
import AdminLayout from 'src/layouts/admin';
// components
import Iconify from 'src/components/iconify';
import { SkeletonPostItem } from 'src/components/skeleton';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// sections
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from 'src/sections/@admin/blog';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

BlogPostsPage.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;

// ----------------------------------------------------------------------

export default function BlogPostsPage() {
  const { themeStretch } = useSettingsContext();

  const [posts, setPosts] = useState([]);

  const [sortBy, setSortBy] = useState('latest');

  const sortedPosts = applySortBy(posts, sortBy);

  const getAllPosts = useCallback(async () => {
    try {
      const response = await axios.get('/api/blog/posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAllPosts();
  }, [getAllPosts]);

  const handleChangeSortBy = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value);
  };

  return (
    <>
      <Head>
        <title> Blog: Posts | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Blog"
          links={[
            {
              name: 'Dashboard',
              href: PATH_ADMIN.root,
            },
            {
              name: 'Blog',
              href: PATH_ADMIN.blog.root,
            },
            {
              name: 'Posts',
            },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_ADMIN.blog.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Post
            </Button>
          }
        />

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch />
          <BlogPostsSort sortBy={sortBy} sortOptions={SORT_OPTIONS} onSort={handleChangeSortBy} />
        </Stack>

        <Grid container spacing={3}>
          {(!posts.length ? [...Array(12)] : sortedPosts).map((post, index) =>
            post ? (
              <Grid key={post.id} item xs={12} sm={6} md={(index === 0 && 6) || 3}>
                <BlogPostCard post={post} index={index} />
              </Grid>
            ) : (
              <SkeletonPostItem key={index} />
            )
          )}
        </Grid>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

const applySortBy = (posts: IBlogPost[], sortBy: string) => {
  if (sortBy === 'latest') {
    return orderBy(posts, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    return orderBy(posts, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    return orderBy(posts, ['view'], ['desc']);
  }
  return posts;
};
