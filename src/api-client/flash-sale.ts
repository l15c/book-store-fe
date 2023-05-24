import { IFlashSale } from 'src/@types/flash-sale';
import { GET, POST, PUT, DELETE } from './axios';

const flashSaleApi = {
  getList: () => GET<IFlashSale[]>('/sales'),
  getById: (id: number) => GET<IFlashSale>(`/sales/id?id=${id}`),
  getCurrentSale: () => GET<IFlashSale>(`/sales/current-sale`),
  create: (data: Omit<IFlashSale, 'id'>) => POST<Omit<IFlashSale, 'id'>, unknown>('/sales', data),
  update: (data: IFlashSale) => PUT<IFlashSale, IFlashSale>('/sales', data),
  delete: (id: number) => DELETE(`/sales/id?id=${id}`),
};

export default flashSaleApi;
