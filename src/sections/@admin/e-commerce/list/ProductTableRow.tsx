import moment from 'moment';
import { useState } from 'react';
// @mui
import {
  Button,
  Checkbox,
  IconButton,
  Link,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
} from '@mui/material';
// utils
import { fCurrency } from 'src/utils/formatNumber';
import { getUrlImage } from 'src/utils/cloudinary';
// @types
import { IBookCompact } from 'src/@types/book';
// components
import ConfirmDialog from 'src/components/confirm-dialog';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import Label from 'src/components/label';
import MenuPopover from 'src/components/menu-popover';
// hooks
import useCountdown from '../../../../hooks/useCountdown';

// ----------------------------------------------------------------------

type Props = {
  row: IBookCompact;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

const LabelFlashSale = ({ discount, endDate }: { discount: number; endDate: string }) => {
  const { days, hours, minutes, seconds } = useCountdown(new Date(endDate));

  return (
    <Label
      variant="soft"
      color="secondary"
      sx={{
        lineHeight: 1.3,
        height: 'unset',
        py: 0.5,
      }}
    >
      {`Flash sale (${discount}%)`}
      <br />
      {`Kết thúc sau ${+days > 0 ? `${days}:` : ''}${hours}:${minutes}:${seconds}`}
    </Label>
  );
};

export default function ProductTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}: Props) {
  const { name, cover, slug, quantity, price, discount, saleEndDate, saleStartDate, sold } = row;

  const stopSale = quantity < 0;
  const outOfStock = quantity === 0;
  const lowStock = quantity < 15;

  const renderStock = () => (
    <Label
      variant="soft"
      color={
        (stopSale && 'error') || (outOfStock && 'default') || (lowStock && 'warning') || 'default'
      }
    >
      {(stopSale && 'Ngừng kinh doanh') ||
        (outOfStock && 'Hết hàng') ||
        (lowStock && 'Sắp hết hàng')}
    </Label>
  );
  const sale = !!discount;
  const isFlashSale = moment().isBetween(saleStartDate, saleEndDate, 'hours', '[]');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Image
              disabledEffect
              visibleByDefault
              alt={name}
              src={getUrlImage.product(cover, slug)}
              sx={{ borderRadius: 1.5, width: 48, height: 48 }}
            />

            <Link
              noWrap
              color="inherit"
              variant="subtitle2"
              onClick={onEditRow}
              sx={{ cursor: 'pointer', width: 320 }}
            >
              {name}
            </Link>
          </Stack>
        </TableCell>

        <TableCell align="center">{stopSale ? '-' : quantity}</TableCell>
        <TableCell align="center">{sold}</TableCell>

        <TableCell align="center">
          <Stack spacing={1}>
            {quantity < 15 && renderStock()}
            {(!stopSale && isFlashSale && (
              <LabelFlashSale discount={discount} endDate={saleEndDate!} />
            )) ||
              (!stopSale && sale && (
                <Label variant="soft" color="success">
                  {`Giảm giá (${discount}%)`}
                </Label>
              ))}
          </Stack>
        </TableCell>

        <TableCell align="right" sx={{ wordWrap: 'no-wrap' }}>
          {fCurrency(price)}
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Xóa
        </MenuItem>

        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Xem
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Xoá sản phẩm"
        content={
          <>
            Bạn có chắc chắn muốn xoá <strong> {name} </strong>?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Xoá
          </Button>
        }
      />
    </>
  );
}
