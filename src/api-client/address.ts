import { IUserAddress } from 'src/@types/user';
import { GET, POST, PUT, DELETE } from './axios';

import { Create } from './type';

const addressApi = {
  getList: () => GET<IUserAddress[]>('/address'),

  create: (data: Create<IUserAddress>) =>
    POST<Create<IUserAddress>, IUserAddress>('/address', data),

  update: (data: IUserAddress) => PUT<IUserAddress, IUserAddress>('/address', data),

  delete: (id: number) => DELETE(`/address/${id}`),

  // GHN API
  getProvinces: async () => {
    const res = await GET<ResponseGHN<IProvinceGHN[]>>('/ghn/master-data/province');
    return res.data || [];
  },

  getDistrict: async (pId: number) => {
    const res = await GET<ResponseGHN<IDistrictGHN[]>>(
      `/ghn/master-data/district?province_id=${pId}`
    );
    if (!res.data) throw new Error();
    return res.data || [];
  },

  getWard: async (dId: number) => {
    const res = await GET<ResponseGHN<IWardGHN[]>>(`/ghn/master-data/ward?district_id=${dId}`);
    if (!res.data) throw new Error();
    return res.data || [];
  },
  checkFee: async (data: Pick<ShippingFeeRequest, 'to_district_id' | 'to_ward_code'>) => {
    const body: Partial<ShippingFeeRequest> = {
      ...data,
      service_id: 53320,
      service_type_id: 2,
      coupon: null,
      insurance_value: 100000,
      weight: 1000,
      length: 5,
      width: 5,
      height: 5,
    };
    const res = await POST<Partial<ShippingFeeRequest>, ResponseGHN<ShippingFeeResponse>>(
      '/ghn/v2/shipping-order/fee',
      body
    );
    if (!res.data) throw new Error();
    return res.data;
  },
};

export default addressApi;

type ResponseGHN<T> = {
  code: number;
  message: string;
  data: T;
};

type BaseData = {
  NameExtension: string[];
  IsEnable: number;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  CanUpdateCOD: boolean;
  Status: 1 | 2;
  UpdatedIP: string;
  UpdatedEmployee: number;
  UpdatedSource: string;
  UpdatedDate: string;
};

export interface IProvinceGHN extends BaseData {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
  RegionID: number;
  RegionCPN: number;
}

export interface IDistrictGHN extends BaseData {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code: string;
  Type: number;
  SupportType: 0 | 1 | 2 | 3;
  PickType: number;
  DeliverType: number;
  // WhiteListClient: {
  //   From: number[];
  //   To: number[];
  //   Return: number[];
  // };
  // WhiteListDistrict: {
  //   From: null;
  //   To: null;
  // };
  // ReasonCode: string;
  // ReasonMessage: string;
  // OnDates: null;
}

export interface IWardGHN extends BaseData {
  WardCode: string;
  DistrictID: number;
  WardName: string;
  SupportType: 0 | 1 | 2 | 3;
  PickType: number;
  DeliverType: number;
  // WhiteListClient: {
  //   From: null;
  //   To: null;
  //   Return: null;
  // };
  // WhiteListWard: {
  //   From: null;
  //   To: null;
  // };
  // ReasonCode: '';
  // ReasonMessage: '';
  // OnDates: null;
}
type ShippingFeeRequest = {
  from_district_id: number;
  service_id: number;
  service_type_id: 0 | 1 | 2 | 3 | null;
  to_district_id: number;
  to_ward_code: string;
  height: number;
  length: number;
  weight: number;
  width: number;
  insurance_value: number;
  coupon: string | null;
};

export type ShippingFeeResponse = {
  total: number;
  service_fee: number;
  insurance_fee: number;
  pick_station_fee: number;
  coupon_value: number;
  r2s_fee: number;
};
