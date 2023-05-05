import { IAuthUser, IUserAddress } from 'src/@types/user';
import { GET, POST, PUT, DELETE } from './axios';

import { Create } from './type';

const addressApi = {
  getList: () => GET<IUserAddress[]>('/address'),

  add: (data: Create<IUserAddress>) => POST<Create<IUserAddress>, IUserAddress>('/address', data),

  update: (data: IUserAddress) => PUT<IUserAddress, IAuthUser>('/address', data),

  delete: (id: string) => DELETE(`/address/${id}`),

  // ProvinceAPI
  getProvinces: () => GET<ProvinceAPI[]>('/provinces/p/'),

  getDistrict: (pId: number) => GET<DistrictRes>(`/provinces/p/${pId}?depth=2`),

  getWard: (dId: number) => GET<WardRes>(`/provinces/d/${dId}?depth=2`),
};

export default addressApi;

export type ProvinceAPI = {
  name: string;
  code: number;
};

export type DistrictRes = {
  name: string;
  code: number;
  districts: ProvinceAPI[];
};

export type WardRes = {
  name: string;
  code: number;
  wards: ProvinceAPI[];
};
