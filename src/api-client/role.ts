import { GET, POST, DELETE } from './axios';

const cartApi = {
  get: () => GET('/carts'),
  update: (data: any) => POST('/carts', data),
  remove: (id: string) => DELETE(`/carts?bookId=${id}`),
  clear: () => DELETE('/carts/clear'),
};

export default cartApi;
