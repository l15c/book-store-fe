import { ICartResponse } from 'src/@types/book';
import { GET, POST, DELETE } from './axios';

type ICartItemReq = { bookId: number; quantity: number };

const cartApi = {
  get: () => GET<ICartResponse[]>('/carts'),
  updateMultiple: (data: ICartItemReq[]) =>
    POST<ICartItemReq[], ICartResponse[]>('carts/batch', data),
  update: (data: ICartItemReq) => POST<ICartItemReq, ICartResponse>('/carts', data),
  remove: (id: number) => DELETE(`/carts?bookId=${id}`),
  clear: () => DELETE('/carts/clear'),
};

export default cartApi;
