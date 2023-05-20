import { ICartResponse } from 'src/@types/book';
import { GET, POST, DELETE } from './axios';

type IFlashSale = {
  id: 1;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

const flashSaleApi = {
  getList: () => GET('/orders'),
  adminGetAll: () => GET('/orders/all'),
  getById: (id: string) => GET(`/orders/${id}`),
  create: (data: any) => POST('/orders', data),
  update: (data: any) => POST('/orders', data),
  remove: (id: string) => DELETE(`/orders?bookId=${id}`),
  clear: () => DELETE('/orders/clear'),
};

export default flashSaleApi;
