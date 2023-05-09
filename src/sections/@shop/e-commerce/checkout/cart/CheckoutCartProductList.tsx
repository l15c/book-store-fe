// @mui
import { Table, TableBody, TableContainer, alpha } from '@mui/material';
import { ICartItem } from 'src/@types/book';
// @types
// components
import Scrollbar from '../../../../../components/scrollbar';
import { TableHeadCustom } from '../../../../../components/table';
import CheckoutCartProduct from './CheckoutCartProduct';
//

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product', label: 'Sản phẩm' },
  { id: 'price', label: 'Đơn giá' },
  { id: 'quantity', label: 'Số lượng', align: 'center' },
  { id: 'totalPrice', label: 'Tổng tiền', align: 'right', minWidth: 108 },
  { id: '' },
];

// ----------------------------------------------------------------------

type Props = {
  products: ICartItem[];
  selected: ICartItem[];
  onSelectRow: (product: ICartItem) => void;
  onSelectAllRows: (checked: boolean, newSelecteds: ICartItem[]) => void;
  onDelete: (id: number) => void;
  onAddCart: (product: ICartItem) => void;
  onDecreaseQuantity: (id: number) => void;
  onIncreaseQuantity: (id: number) => void;
};

export default function CheckoutCartProductList({
  products,
  selected,
  onSelectRow,
  onSelectAllRows,
  onDelete,
  onAddCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: Props) {
  return (
    <TableContainer sx={{ overflow: 'unset' }}>
      <Scrollbar sx={{ maxHeight: 424 }}>
        <Table stickyHeader sx={{ minWidth: 720 }}>
          <TableHeadCustom
            headLabel={TABLE_HEAD}
            rowCount={products.length}
            numSelected={selected.length}
            onSelectAllRows={(checked) => onSelectAllRows(checked, products)}
            sx={{ whiteSpace: 'nowrap' }}
          />

          <TableBody
            sx={{
              '& .Mui-selected': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                '&:hover': { backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08) },
              },
            }}
          >
            {products.map((row) => (
              <CheckoutCartProduct
                key={row.id}
                row={row}
                selected={!!selected.find((e) => e.id === row.id)}
                onSelectRow={() => onSelectRow(row)}
                onDelete={() => onDelete(row.id)}
                onAddCart={onAddCart}
                onDecrease={() => onDecreaseQuantity(row.id)}
                onIncrease={() => onIncreaseQuantity(row.id)}
              />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}
