// import { useCallback, useRef, useState } from 'react';
// import { useQuery, UseQueryOptions } from '@tanstack/react-query';
// import { useSnackbar } from 'notistack';
// // @types
// import _ from 'lodash';
// import { AxiosResponse } from 'axios';

// type UsePaginatorOptions = {
//   queryKey: unknown[];
//   fetch: (page: number, limit: number) => Promise<unknown>;
//   limit: number;
// };

// type _QueryOption<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;

// const usePaginator = <T = any>(p: UsePaginatorOptions, q: _QueryOption<T> = {}) => {
//   const { enqueueSnackbar } = useSnackbar();
//   const prevKey = useRef(p.queryKey);
//   const [page, setPage] = useState(0);

//   const query = useQuery<T[]>({
//     queryKey: [...p.queryKey, page],
//     queryFn: () => p.fetch(page, p.limit) as Promise<any>,
//     keepPreviousData: true,
//     ...q,
//     onSuccess({ Data = [], TotalItemCount: _count = 0 }) {
//       const lastPage = Math.max(Math.ceil(_count / p.limit) - 1, 0);

//       if (_count === 0 && page !== 0) setPage(0);

//       if (!!_count && Data.length === 0) {
//         setPage(lastPage);
//       }
//     },
//     onError() {
//       enqueueSnackbar('Đã xảy ra lỗi. Vui lòng thử lại', { variant: 'error' });
//     },
//   });

//   const {data} = query;

//   //   const pages = Math.max(Math.ceil(count / p.limit) - 1, 0);

//   //   // Reset page if queryKey change
//   //   if (!_.isEqual(prevKey.current, p.queryKey)) {
//   //     setPage(0);
//   //     prevKey.current = p.queryKey;
//   //   }

//   //   const next = useCallback(() => {
//   //     setPage((curPage) => curPage + (curPage >= pages ? 0 : 1));
//   //   }, [setPage, pages]);

//   //   const back = useCallback(() => {
//   //     setPage((curPage) => curPage - (curPage <= 0 ? 0 : 1));
//   //   }, [setPage]);

//   //   const showing = page * p.limit + (items!.length > 0 ? 1 : 0);
//   //   const showingEnd = Math.min((page + 1) * p.limit, count);

//   return {
//     count,
//     page,
//     pages,
//     items,
//     hasMore,
//     showing: { start: showing, end: showingEnd },
//     back,
//     next,
//     ...query,
//     isError: query.isError || !success,
//   };
// };

// export default usePaginator;

export default {};
