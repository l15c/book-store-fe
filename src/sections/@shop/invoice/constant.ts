import { LabelColor } from 'src/components/label';

export const GROUP_STATUS: { [key: string]: string[] } = {
  default: ['Đã thanh toán', 'Đang xử lý'],
  success: ['Giao hàng thành công', 'Đổi/trả', 'Hoàn tiền', 'Đã hoàn thành'],
  warning: ['Chờ thanh toán', 'Đang giao hàng', 'Yêu cầu hủy', 'Giao hàng thất bại'],
  error: ['Đã hủy'],
};

export const COLOR_STATUS: { [key: string]: LabelColor } = {
  'Chờ thanh toán': 'warning',
  'Đã thanh toán': 'success',
  'Đang xử lý': 'default',
  'Yêu cầu hủy': 'error',
  'Giao hàng thất bại': 'error',

  'Giao hàng thành công': 'success',
  'Đổi/trả': 'warning',
  'Hoàn tiền': 'warning',
  'Đã hoàn thành': 'success',

  'Đang giao hàng': 'warning',
  'Đã hủy': 'error',
};
