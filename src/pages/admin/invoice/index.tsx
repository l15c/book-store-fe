import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import {
  Card,
  Container,
  Divider,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
} from '@mui/material';
// routes
import { PATH_ADMIN } from 'src/routes/paths';
// api
import orderApi from 'src/api-client/order';
// utils
import { fTimestampDate } from 'src/utils/formatTime';
import { toNonAccentVietnamese as nonAccent } from 'src/utils/stringConverter';
// @types
import { IOrder } from 'src/@types/order';
// layouts
import AdminLayout from 'src/layouts/admin';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  emptyRows,
  getComparator,
  useTable,
} from 'src/components/table';
// sections
import { GROUP_STATUS } from 'src/sections/@admin/invoice/constant';
import { InvoiceTableRow, InvoiceTableToolbar } from 'src/sections/@admin/invoice/list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'shipName', label: 'Thông tin đơn hàng', align: 'left', width: 400, minWidth: 400 },
  { id: 'orderDate', label: 'Ngày đặt hàng', align: 'center' },
  { id: 'dateOfPayment', label: 'Ngày thanh toán', align: 'center' },
  { id: 'totalPrice', label: 'Tổng đơn hàng', align: 'center', width: 140 },
  { id: 'status', label: 'Trạng thái', align: 'center', width: 180 },
  { id: 'action' },
];

// ----------------------------------------------------------------------

InvoiceIndexPage.getLayout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>;

// ----------------------------------------------------------------------

export default function InvoiceIndexPage() {
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
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'orderDate', defaultOrder: 'desc' });

  const { data: tableData = [], isFetching } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => orderApi.adminGetAll(),
  });

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState('all');

  const [serviceOpt, setServiceOpt] = useState([
    ...Object.keys(GROUP_STATUS)
      .map((key) => GROUP_STATUS[key])
      .flat(),
  ]);
  const [filterService, setFilterService] = useState('Tất cả');

  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterService,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterStatus !== 'all' ||
    filterName !== '' ||
    filterService !== 'Tất cả' ||
    (!!filterStartDate && !!filterEndDate);

  const isNotFound = dataFiltered.length === 0;

  const getLengthByColorGroup = (color: string) =>
    tableData.filter((item) => GROUP_STATUS[color].includes(item.status)).length;

  const TABS = [
    { value: 'all', label: 'Tất cả', color: 'info', count: tableData.length },
    {
      value: 'success',
      label: 'Thành công',
      color: 'success',
      count: getLengthByColorGroup('success'),
    },
    {
      value: 'warning',
      label: 'Chờ giải quyết',
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
      label: 'Chờ xác nhận',
      color: 'default',
      count: getLengthByColorGroup('default'),
    },
  ] as const;

  const handleFilterStatus = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setPage(0);
    setFilterService('Tất cả');
    if (newValue === 'all') {
      setServiceOpt(
        Object.keys(GROUP_STATUS)
          .map((key) => GROUP_STATUS[key])
          .flat()
      );
    } else {
      setServiceOpt(GROUP_STATUS[newValue]);
    }
    setFilterStatus(newValue);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterService = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterService(event.target.value);
  };

  const handleViewRow = (id: string) => {
    push(PATH_ADMIN.invoice.view(id));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('all');
    setFilterService('Tất cả');
    setFilterEndDate(null);
    setFilterStartDate(null);
  };

  return (
    <>
      <Head>
        <title>Danh sách đơn hàng | Book Store</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          links={[
            {
              name: 'Trang chủ',
              href: PATH_ADMIN.root,
            },
            {
              name: 'Danh sách đơn hàng',
            },
          ]}
        />
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
            filterService={filterService}
            filterEndDate={filterEndDate}
            onFilterName={handleFilterName}
            optionsService={['Tất cả', ...serviceOpt]}
            onResetFilter={handleResetFilter}
            filterStartDate={filterStartDate}
            onFilterService={handleFilterService}
            onFilterStartDate={(newValue) => {
              setFilterStartDate(newValue);
            }}
            onFilterEndDate={(newValue) => {
              setFilterEndDate(newValue);
            }}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
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
  filterService,
  filterStartDate,
  filterEndDate,
}: {
  inputData: IOrder[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterService: string;
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

  inputData = inputData.filter(
    (order) =>
      nonAccent(order.shipName.toLowerCase()).indexOf(nonAccent(filterName.toLowerCase())) !== -1 ||
      nonAccent(order.displayAddress.toLowerCase()).indexOf(nonAccent(filterName.toLowerCase())) !==
        -1 ||
      nonAccent(order.shipPhone.toLowerCase()).indexOf(nonAccent(filterName.toLowerCase())) !==
        -1 ||
      nonAccent(order.id.toLowerCase()).indexOf(nonAccent(filterName.toLowerCase())) !== -1
  );

  if (filterStatus !== 'all') {
    inputData = inputData.filter((order) => GROUP_STATUS[filterStatus].includes(order.status));
  }

  if (filterService !== 'Tất cả') {
    inputData = inputData.filter((order) => filterService === order.status);
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
