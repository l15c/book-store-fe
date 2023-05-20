import { CreateOrder, IOrder } from 'src/@types/order';
import { GET, POST, DELETE, PUT } from './axios';

const orderApi = {
  getList: () => GET<IOrder[]>('/orders'),
  adminGetAll: () => GET<IOrder[]>('/orders/all'),
  getById: (id: string) => GET<IOrder>(`/orders/${id}`),
  create: (data: CreateOrder) => POST<CreateOrder, IOrder | string>('/orders', data),
  update: (data: { orderId: string; status: string }) => PUT('/orders', data),
  remove: (id: string) => DELETE(`/orders?bookId=${id}`),
  clear: () => DELETE('/orders/clear'),
  cancelOrder: (id: string) => POST(`/orders/cancel-order?orderId=${id}`, {}),
};

export default orderApi;
