import { useState } from 'react';
// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
// routes
import { PATH_ADMIN, PATH_SHOP } from 'src/routes/paths';
// @types
// layouts
import AdminLayout from 'src/layouts/admin';
// components
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TablePaginationActionsExtra,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ConfirmDialog from 'src/components/confirm-dialog';
// sections
import { ProductTableRow, ProductTableToolbar } from 'src/sections/@admin/e-commerce/list';
import { useQuery } from '@tanstack/react-query';
import bookApi from 'src/api-client/book';
import useDebounce from 'src/hooks/useDebounce';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Name', label: 'Tên sản phẩm', align: 'left', width: 320 },
  { id: 'Quantity', label: 'Số lượng', align: 'center' },
  { id: 'Sold', label: 'Đã bán', align: 'center' },
  { id: 'Discount', label: 'Trạng thái', align: 'center', width: 180 },
  { id: 'Price', label: 'Đơn giá', align: 'right' },
  { id: 'actions', disableSort: true },
];

const STATUS_OPTIONS = [
  { value: 'FlashSale', label: 'Flash sale' },
  { value: 'Discount', label: 'Đang giảm giá' },
  { value: 'OutOfStock', label: 'Hết hàng' },
  { value: 'LowStock', label: 'Sắp hết hàng' },
  { value: 'InStock', label: 'Còn hàng' },
  { value: 'StopSale', label: 'Ngừng kinh doanh' },
];

// ----------------------------------------------------------------------

EcommerceProductListPage.getLayout = (page: React.ReactElement) => (
  <AdminLayout>{page}</AdminLayout>
);

// ----------------------------------------------------------------------

export default function EcommerceProductListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'releaseDate',
    defaultDense: true,
  });

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();

  const [filterName, setFilterName] = useState('');
  const searchText = useDebounce(filterName, 500);

  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const { data, isFetching } = useQuery({
    queryKey: [
      'products',
      'list',
      {
        search: searchText,
        sortBy: orderBy,
        sortDirection: order,
        pageSize: rowsPerPage,
        type: filterStatus,
      },
      page,
    ],
    queryFn: () =>
      bookApi.getList({
        page,
        pageSize: rowsPerPage,
        type: filterStatus,
        search: searchText,
        sortBy: orderBy,
        sortDirection: order,
      }),
    keepPreviousData: true,
  });

  const { totalCount = 0 } = data ?? {};
  const books = data?.data ?? [];

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = (!books.length && !!filterName) || (!isFetching && !books.length);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterStatus = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setPage(0);
    setFilterStatus(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDeleteRow = (id: string | number) => {
    if (page > 0) {
      if (books.length < 1) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selectedRows: (string | number)[]) => {};

  const handleEditRow = (slug: string) => {
    push(PATH_ADMIN.eCommerce.edit(slug));
  };

  const handleViewRow = (slug: string) => {
    push(PATH_SHOP.product.view(slug));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  return (
    <>
      <Head>
        <title> Dánh sách sản phẩm | Book Store</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading=""
          links={[{ name: 'Trang chủ', href: PATH_ADMIN.root }, { name: 'Danh sách sản phẩm' }]}
          action={
            <Button
              component={NextLink}
              href={PATH_ADMIN.eCommerce.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Thêm mới
            </Button>
          }
        />

        <Card>
          <ProductTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            statusOptions={STATUS_OPTIONS}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={books.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  books.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={books.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      books.map((row) => row.id)
                    )
                  }
                  sx={{ whiteSpace: 'nowrap' }}
                />

                <TableBody>
                  {(isFetching ? [...Array(rowsPerPage)] : books).map((row, index) =>
                    row ? (
                      <ProductTableRow
                        key={row.id + row.slug}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.slug)}
                        onViewRow={() => handleViewRow(row.slug)}
                      />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    )
                  )}

                  {!isFetching && !isNotFound && (
                    <TableEmptyRows height={denseHeight} emptyRows={rowsPerPage - books.length} />
                  )}

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
            ActionsComponent={TablePaginationActionsExtra}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Xoá sản phẩm"
        content={
          <>
            Bạn có chắc chắn muốn xoá <strong> {selected.length} </strong> sản phẩm đã chọn?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Xoá
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------
