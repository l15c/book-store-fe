import { AxiosRequestConfig } from 'axios';
import { IAuthUser } from 'src/@types/user';

export type Config<D = any> = AxiosRequestConfig<D>;

export type Create<T> = Omit<T, 'id'>;

export type LoginPayload = {
  phone: string;
  password: string;
};

export type AuthResponse = {
  // token: string;
  // refreshToken: string;
  user: IAuthUser;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
};

export type SearchPayload = Partial<{
  search: string;
  authorId: number[];
  publisherId: number[];
  genreId: number[];
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  startPrice: number;
  endPrice: number;
  type: string[];
  isFlashSale: boolean;
}>;

export type ListResponse<T> = {
  data: T[];
  pageSize: number;
  page: number;
  totalPages: number;
  totalCount: number;
};
