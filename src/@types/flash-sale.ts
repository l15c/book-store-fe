export type SaleBook = {
  bookId: number;
  discount: number;
  quantity: number;
};

export type IFlashSale = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  saleBooks: SaleBook[];
};
