export type Order = {
  shipName: string;
  shipPhone: string;
  shipNote: string;
  userAddressId: number;
  payType: string;
  deliveryFee: number;
  checkedCartId: number[];
};
