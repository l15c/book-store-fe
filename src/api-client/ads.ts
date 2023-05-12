import { GET } from './axios';
import { Config } from './type';

export type IAds = {
  id: number;
  image: string;
};

export const adsApi = {
  getList: (config?: Config) => GET<IAds[]>('/ads', config),
};
