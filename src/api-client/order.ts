import { GET, POST, DELETE } from './axios';

const orderApi = {
  get: () => GET('/orders'),
  update: (data: any) => POST('/orders', data),
  remove: (id: string) => DELETE(`/orders?bookId=${id}`),
  clear: () => DELETE('/orders/clear'),
};

export default orderApi;
