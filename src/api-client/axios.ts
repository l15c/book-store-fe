import axios from 'axios';
import { Config } from './type';
// config
// import { HOST_API_KEY } from '../config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: '/api' });

// axiosInstance.interceptors.request.use(
//   (config: AxiosRequestConfig) => {
//     if (typeof window !== 'undefined') {
//       const accessToken = localStorage.getItem('accessToken');
//       // if (!config) return;
//       const { headers } = config;
//       // if (!headers) return;
//       // const common: any = headers!.common || {};
//       // common['Access-Control-Allow-Origin'] = '*';
//       // if (!accessToken) return;
//       headers!.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (err) => Promise.reject(err)
// );

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject((error && error.response) || 'Đã có lỗi xảy ra')
);

export const GET = <Res>(url: string, cfg?: Config) => axiosInstance.get<never, Res>(url, cfg);

export const POST = <Req, Res>(url: string, body: Req, cfg?: Config<Req>) =>
  axiosInstance.post<never, Res, Req>(url, body, cfg);

export const PUT = <Req, Res>(url: string, body: Req, cfg?: Config<Req>) =>
  axiosInstance.put<never, Res, Req>(url, body, cfg);

export const DELETE = <Res>(url: string, cfg?: Config) =>
  axiosInstance.delete<never, Res>(url, cfg);

export default axiosInstance;
