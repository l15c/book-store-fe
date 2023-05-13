// @mui
import { Link, Button, Divider, Typography, Stack, DialogProps } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import { DialogAnimate } from '../../../../components/animate';
// assets
import { OrderCompleteIllustration } from '../../../../assets/illustrations';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  orderId?: string;
  onReset: VoidFunction;
  onDownloadPDF: VoidFunction;
}

export default function CheckoutOrderComplete({ orderId, open, onReset, onDownloadPDF }: Props) {
  return (
    <DialogAnimate
      fullScreen
      open={open}
      PaperProps={{
        sx: {
          maxWidth: { md: 'calc(100% - 48px)' },
          maxHeight: { md: 'calc(100% - 48px)' },
        },
      }}
    >
      <Stack
        spacing={5}
        sx={{
          m: 'auto',
          maxWidth: 480,
          textAlign: 'center',
          px: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h4">Cảm ơn bạn đã mua hàng</Typography>

        <OrderCompleteIllustration sx={{ height: 260 }} />

        <Typography>
          Cảm ơn đã đặt hàng tại Book Store
          <br />
          <br />
          <Link href={`/orders/${orderId}`}>{orderId}</Link>
          <br />
          <br />
          Chúng tôi sẽ gửi thông báo cho bạn trong vòng 5 ngày khi hàng được giao.
          <br /> Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào, hãy liên hệ với chúng tôi. <br />
          Chúc một ngày tốt lành
          <br />
        </Typography>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack
          spacing={2}
          justifyContent="space-between"
          direction={{ xs: 'column-reverse', sm: 'row' }}
        >
          <Button
            fullWidth
            size="large"
            color="inherit"
            variant="outlined"
            onClick={onReset}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Tiếp tục mua sắm
          </Button>

          <Button
            fullWidth
            size="large"
            variant="contained"
            startIcon={<Iconify icon="ant-design:file-pdf-filled" />}
            onClick={onDownloadPDF}
          >
            Tải xuống hóa đơn
          </Button>
        </Stack>
      </Stack>
    </DialogAnimate>
  );
}
