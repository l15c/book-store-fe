export type MomoPaymentType = 'captureWallet' | 'payWithCC' | 'payWithATM';

export type PayType = 'cash' | MomoPaymentType;

export type IOrderDetail = {
  id: number;
  orderId: number;
  bookId: number;
  cover: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
};

export type IOrder = {
  id: string;
  orderDate: string;
  shipName: string;
  shipPhone: string;
  shipNote: string;
  displayAddress: string;
  deliveryFee: number;
  discountPrice: number;
  totalPrice: number;
  status: string;
  dayOfPayment: string;
  isPay: boolean;
  payType: PayType;
  orderDetails: IOrderDetail[];
};

export type CreateOrder = {
  shipNote: string;
  userAddressId: number;
  payType: PayType;
  deliveryFee: number;
  checkedCartId: number[];
  voucherId: number;
};
