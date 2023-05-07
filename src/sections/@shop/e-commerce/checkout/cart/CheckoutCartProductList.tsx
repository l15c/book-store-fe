// @mui
import { Table, TableBody, TableContainer } from '@mui/material';
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
  { id: 'quantity', label: 'Số lượng' },
  { id: 'totalPrice', label: 'Tổng tiền', align: 'right' },
  { id: '' },
];

// ----------------------------------------------------------------------

type Props = {
  products: ICartItem[];
  onDelete: (id: number) => void;
  onDecreaseQuantity: (id: number) => void;
  onIncreaseQuantity: (id: number) => void;
};

export default function CheckoutCartProductList({
  products,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: Props) {
  return (
    <TableContainer sx={{ overflow: 'unset' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 720 }}>
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            {products.map((row) => (
              <CheckoutCartProduct
                key={row.id}
                row={row}
                onDelete={() => onDelete(row.id)}
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
