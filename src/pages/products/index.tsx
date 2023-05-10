import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// form
import { useForm } from 'react-hook-form';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Container, Typography, Stack, Pagination } from '@mui/material';
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
import { IProductFilter } from 'src/@types/book';
import useDebounce from 'src/hooks/useDebounce';
import { useData } from 'src/hooks/data';
import { SearchPayload } from 'src/api-client/type';

// ----------------------------------------------------------------------

ProductsPage.getLayout = (page: React.ReactElement) => <ShopLayout noAuth>{page}</ShopLayout>;

// ----------------------------------------------------------------------
const PRICE_RANGE: [number, number] = [0, 1000000];
const PAGE_SIZE = 12;

export default function ProductsPage() {
  const { themeStretch } = useSettingsContext();

  const { query } = useRouter();

  const search = (query.q ?? '') as string;

  const [openFilter, setOpenFilter] = useState(false);

  const defaultValues: IProductFilter = {
    authors: [],
    genres: [],
    publishers: [],
    priceRange: PRICE_RANGE,
    sortBy: 'Sold',
    sortDirection: 'desc',
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
  const {
    sortBy,
    sortDirection,
    priceRange,
    genres: genresF,
    authors: authorsF,
    publishers: publishersF,
  } = values;
  const [min, max] = useDebounce(priceRange, 700);

  const [page, setPage] = useState(0);

  const fixMinMax = (value: number) => Math.max(PRICE_RANGE[0], Math.min(PRICE_RANGE[1], value));

  // ----------------------------------------------------------------------

  const filter: SearchPayload = {
    search,
    sortBy: sortBy.replace('+', ''),
    sortDirection,
    authorId: authorsF.map((e) => e.id),
    genreId: genresF.map((e) => e.id),
    publisherId: publishersF.map((e) => e.id),
    startPrice: fixMinMax(min),
    endPrice: fixMinMax(max),
  };
  const { data, isFetching } = useQuery({
    queryKey: ['products', filter, page, PAGE_SIZE],
    queryFn: () =>
      bookApi.getList({
        page,
        pageSize: PAGE_SIZE,
        ...filter,
      }),
    keepPreviousData: true,
    staleTime: Infinity,
  });
  const books = data?.data ?? [];

  const {
    query: { genreQuery, authorQuery, publisherQuery },
  } = useData();

  const authors = authorQuery.data ?? [];
  const genres = genreQuery.data ?? [];
  const publishers = publisherQuery.data ?? [];

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
        <title>Danh sách sản phẩm | Book Store</title>
      </Head>

      <FormProvider methods={methods}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ my: 1 }}>
            <Stack my="auto">
              {!isFetching && (!isDefault || search) && data?.totalCount !== 0 && (
                <Typography variant="body2">
                  Tìm thấy <strong>{data?.totalCount}</strong>
                  &nbsp;sản phẩm
                  {search && (
                    <>
                      &nbsp;khớp với <strong>&ldquo;{search}&rdquo;</strong>
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
                publishersOptions={publishers}
                onOpen={handleOpenFilter}
                onClose={handleCloseFilter}
                onResetFilter={handleResetFilter}
              />

              <ShopProductSort />
            </Stack>
          </Stack>

          {!isDefault && (
            <Stack sx={{ mb: 1 }}>
              <ShopTagFiltered isFiltered={!isDefault} onResetFilter={handleResetFilter} />
            </Stack>
          )}

          <ShopProductList books={books} loading={isFetching} />

          {!!data?.totalCount && (
            <Pagination
              count={data?.totalPages}
              page={page + 1}
              onChange={(e, p) => setPage(p - 1)}
              showLastButton
              showFirstButton
              boundaryCount={2}
              sx={{
                mt: 2,
                mx: 'auto',
                '& .MuiPagination-ul': {
                  justifyContent: 'center',
                },
              }}
            />
          )}
        </Container>
      </FormProvider>
    </>
  );
}
