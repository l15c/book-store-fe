import { CreateOrder, IOrder } from 'src/@types/order';
import { GET, POST, DELETE } from './axios';

const orderApi = {
  get: () => GET('/orders'),
  create: (data: CreateOrder) => POST<CreateOrder, IOrder | string>('/orders', data),
  update: (data: any) => POST('/orders', data),
  remove: (id: string) => DELETE(`/orders?bookId=${id}`),
  clear: () => DELETE('/orders/clear'),
};

export default orderApi;
