import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// form
import { useForm } from 'react-hook-form';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container, Typography, Stack } from '@mui/material';
// layouts
import ShopLayout from 'src/layouts/shop';
// components
import FormProvider from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
// sections
import {
  ShopTagFiltered,
  ShopProductSort,
  ShopProductList,
  ShopFilterDrawer,
} from 'src/sections/@shop/e-commerce/shop';
// api
import bookApi from 'src/api-client/book';
import genresApi from 'src/api-client/genre';
import authorApi from 'src/api-client/author';
import publisherApi from 'src/api-client/publisher';
import { IProductFilter } from 'src/@types/book';
import useDebounce from 'src/hooks/useDebounce';

// ----------------------------------------------------------------------

ProductsPage.getLayout = (page: React.ReactElement) => <ShopLayout noAuth>{page}</ShopLayout>;

// ----------------------------------------------------------------------
const PRICE_RANGE: [number, number] = [0, 1000000];
const PAGE_SIZE = 12;

export default function ProductsPage() {
  const { themeStretch } = useSettingsContext();

  const { query } = useRouter();

  const search = query.q ?? '';

  const [openFilter, setOpenFilter] = useState(false);

  const defaultValues: IProductFilter = {
    authors: [],
    genres: [],
    publishers: [],
    priceRange: PRICE_RANGE,
    sortBy: 'featured',
    sortDirection: 'asc',
  };

  const methods = useForm<IProductFilter>({
    defaultValues,
  });

  const {
    reset,
    watch,
    formState: { dirtyFields },
  } = methods;

  const isDefault =
    (!dirtyFields.authors &&
      !dirtyFields.genres &&
      !dirtyFields.publishers &&
      !dirtyFields.priceRange &&
      !dirtyFields.sortDirection &&
      !dirtyFields.sortBy) ||
    false;

  const values = watch();
  const [min, max] = useDebounce(values.priceRange, 700);

  const fixMinMax = (value: number) => Math.max(PRICE_RANGE[0], Math.min(PRICE_RANGE[1], value));

  // ----------------------------------------------------------------------

  const filter = { startPrice: fixMinMax(min), endPrice: fixMinMax(max) };
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', filter, PAGE_SIZE],
    queryFn: () =>
      bookApi.getList({
        page: 1,
        pageSize: PAGE_SIZE,
        ...filter,
      }),
    keepPreviousData: true,
    staleTime: Infinity,
  });
  const books = data?.data ?? [];

  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: () => genresApi.getList(),
  });

  const { data: authors = [] } = useQuery({
    queryKey: ['authors'],
    queryFn: () => authorApi.getList(),
  });

  const { data: publisher = [] } = useQuery({
    queryKey: ['publisher'],
    queryFn: () => publisherApi.getList(),
  });

  // ----------------------------------------------------------------------

  const handleResetFilter = () => {
    reset();
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <>
      <Head>
        <title>Danh sách sản phẩm | Book Shop</title>
      </Head>

      <FormProvider methods={methods}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ my: 1 }}>
            <Stack my="auto">
              {(!isDefault || search) && (
                <Typography variant="body2">
                  {/* Tìm thấy <strong>{dataFiltered.length}</strong> */}
                  &nbsp;sản phẩm
                  {search && (
                    <>
                      khớp với <strong>&ldquo;{search}&rdquo;</strong>
                    </>
                  )}
                </Typography>
              )}
            </Stack>
            <Stack direction="row" spacing={1}>
              <ShopFilterDrawer
                isDefault={isDefault}
                open={openFilter}
                priceRange={PRICE_RANGE}
                genresOptions={genres}
                authorsOptions={authors}
                publishersOptions={publisher}
                onOpen={handleOpenFilter}
                onClose={handleCloseFilter}
                onResetFilter={handleResetFilter}
              />

              <ShopProductSort />
            </Stack>
          </Stack>

          {/* {!isDefault && (
            <Stack sx={{ mb: 1 }}>
              <ShopTagFiltered isFiltered={!isDefault} onResetFilter={handleResetFilter} />
            </Stack>
          )} */}

          <ShopProductList books={books} loading={false} />
        </Container>
      </FormProvider>
    </>
  );
}
