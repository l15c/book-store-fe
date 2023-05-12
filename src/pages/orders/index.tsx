import { useState } from 'react';
import sumBy from 'lodash/sumBy';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Tab,
  Tabs,
  Card,
  Table,
  Stack,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
// routes
import { PATH_SHOP } from 'src/routes/paths';
// utils
import { fTimestampDate } from 'src/utils/formatTime';
// @types
import { IOrder } from 'src/@types/order';
// layouts
import ShopLayout from 'src/layouts/shop';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
  TablePaginationActionsExtra,
} from 'src/components/table';
// sections
import InvoiceAnalytic from 'src/sections/@shop/invoice/InvoiceAnalytic';
import { InvoiceTableRow, InvoiceTableToolbar } from 'src/sections/@shop/invoice/list';
import { GROUP_STATUS } from 'src/sections/@shop/invoice/constant';
import { useQuery } from '@tanstack/react-query';
import orderApi from 'src/api-client/order';
import { toNonAccentVietnamese as nonAccent } from 'src/utils/stringConverter';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'shipName', label: 'Thông tin đơn hàng', align: 'left', width: 480, minWidth: 480 },
  { id: 'orderDate', label: 'Ngày đặt hàng', align: 'center' },
  { id: 'dayOfPayment', label: 'Ngày thanh toán', align: 'center' },
  { id: 'totalPrice', label: 'Tổng đơn hàng', align: 'center', width: 140 },
  { id: 'status', label: 'Trạng thái', align: 'center', width: 180 },
];

// ----------------------------------------------------------------------

InvoiceIndexPage.getLayout = (page: React.ReactElement) => <ShopLayout>{page}</ShopLayout>;

// ----------------------------------------------------------------------

export default function InvoiceIndexPage() {
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();

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
  } = useTable({ defaultOrderBy: 'orderDate', defaultOrder: 'desc' });

  const { data: tableData = [], isFetching } = useQuery({
    queryKey: ['user', 'orders'],
    queryFn: () => orderApi.getList(),
  });

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterStatus !== 'all' || filterName !== '' || !!filterStartDate || !!filterEndDate;

  const isNotFound = dataFiltered.length === 0;
  // (!dataFiltered.length && !!filterName) ||
  // (!dataFiltered.length && !!filterStatus) ||
  // (!dataFiltered.length && !!filterEndDate) ||
  // (!dataFiltered.length && !!filterStartDate);

  const getLengthByColorGroup = (color: string) =>
    tableData.filter((item) => GROUP_STATUS[color].includes(item.status)).length;

  const getTotalPriceByColorGroup = (color: string) =>
    sumBy(
      tableData.filter((item) => GROUP_STATUS[color].includes(item.status)),
      (e) => Math.round((e.totalPrice + e.deliveryFee) / 1000) * 1000
    );

  const getPercentByColorGroup = (color: string) =>
    (getLengthByColorGroup(color) / tableData.length) * 100 || 0;

  const TABS = [
    { value: 'all', label: 'Tất cả', color: 'info', count: tableData.length },
    {
      value: 'success',
      label: 'Đã hoàn thành',
      color: 'success',
      count: getLengthByColorGroup('success'),
    },
    {
      value: 'warning',
      label: 'Đang giao hàng',
      color: 'warning',
      count: getLengthByColorGroup('warning'),
    },
    {
      value: 'error',
      label: 'Thất bại',
      color: 'error',
      count: getLengthByColorGroup('error'),
    },
    {
      value: 'default',
      label: 'Đang xử lý',
      color: 'default',
      count: getLengthByColorGroup('default'),
    },
  ] as const;

  const handleFilterStatus = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleViewRow = (id: string) => {
    push(PATH_SHOP.order.detail(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('all');
    setFilterEndDate(null);
    setFilterStartDate(null);
  };

  return (
    <>
      <Head>
        <title>Đơn hàng | Book Store</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          links={[
            {
              name: 'Trang chủ',
              href: PATH_SHOP.root,
            },
            {
              name: 'Danh sách đơn hàng',
            },
          ]}
        />

        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title="Tất cả"
                total={tableData.length}
                percent={tableData.length === 0 && !isFiltered ? 0 : 100}
                price={sumBy(
                  tableData,
                  (e) => Math.round((e.totalPrice + e.deliveryFee) / 1000) * 1000
                )}
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />

              <InvoiceAnalytic
                title="Hoàn thành"
                total={getLengthByColorGroup('success')}
                percent={getPercentByColorGroup('success')}
                price={getTotalPriceByColorGroup('success')}
                icon="eva:checkmark-circle-2-fill"
                color={theme.palette.success.main}
              />

              <InvoiceAnalytic
                title="Đang giao hàng"
                total={getLengthByColorGroup('warning')}
                percent={getPercentByColorGroup('warning')}
                price={getTotalPriceByColorGroup('warning')}
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              />

              <InvoiceAnalytic
                title="Thất bại"
                total={getLengthByColorGroup('error')}
                percent={getPercentByColorGroup('error')}
                price={getTotalPriceByColorGroup('error')}
                icon="eva:bell-fill"
                color={theme.palette.error.main}
              />

              <InvoiceAnalytic
                title="Đang xử lý"
                total={getLengthByColorGroup('default')}
                percent={getPercentByColorGroup('default')}
                price={getTotalPriceByColorGroup('default')}
                icon="eva:file-fill"
                color={theme.palette.text.secondary}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            value={filterStatus}
            onChange={handleFilterStatus}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={
                  <Label color={tab.color} sx={{ mr: 1 }}>
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <Divider />

          <InvoiceTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterEndDate={filterEndDate}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            filterStartDate={filterStartDate}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Tải xuống">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="In đơn hàng">
                    <IconButton color="primary">
                      <Iconify icon="eva:printer-fill" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                  sx={{ whiteSpace: 'nowrap' }}
                />

                <TableBody>
                  {(isFetching ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <InvoiceTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                        />
                      ) : (
                        <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData isNotFound={!isFetching && isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
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
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterStartDate,
  filterEndDate,
}: {
  inputData: IOrder[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterStartDate: Date | null;
  filterEndDate: Date | null;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (order) =>
        nonAccent(order.shipName.toLowerCase()).indexOf(nonAccent(filterName.toLowerCase())) !==
          -1 ||
        nonAccent(order.displayAddress.toLowerCase()).indexOf(
          nonAccent(filterName.toLowerCase())
        ) !== -1 ||
        nonAccent(order.shipPhone.toLowerCase()).indexOf(nonAccent(filterName.toLowerCase())) !==
          -1 ||
        nonAccent(order.id.toLowerCase()).indexOf(nonAccent(filterName.toLowerCase())) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((order) => GROUP_STATUS[filterStatus].includes(order.status));
  }

  if (filterStartDate && filterEndDate) {
    inputData = inputData.filter(
      (order) =>
        fTimestampDate(order.orderDate) >= fTimestampDate(filterStartDate) &&
        fTimestampDate(order.orderDate) <= fTimestampDate(filterEndDate)
    );
  } else if (filterStartDate) {
    inputData = inputData.filter(
      (order) => fTimestampDate(order.orderDate) >= fTimestampDate(filterStartDate)
    );
  } else if (filterEndDate) {
    inputData = inputData.filter(
      (order) => fTimestampDate(order.orderDate) <= fTimestampDate(filterEndDate)
    );
  }

  return inputData;
}
