import { ConfirmResetPassword, IAuthUser, IUserAccountChangePassword } from 'src/@types/user';
import { GET, POST, PUT } from './axios';
import { AuthResponse, LoginPayload, RegisterPayload } from './type';

export const USER_ROLE_ID = 6;

const customerApi = {
  getProfile: () => GET<IAuthUser>('/customers/my-profile'),

  login: (data: LoginPayload) => POST<LoginPayload, AuthResponse>('/auth/login/customers', data),

  register: (data: RegisterPayload) => POST<RegisterPayload, AuthResponse>('/auth/register', data),

  logout: () => POST('/auth/logout', {}),

  update: (id: string, data: any) => PUT('/customers', { id, ...data }),

  changePassword: (data: IUserAccountChangePassword) =>
    POST<IUserAccountChangePassword, unknown>('/customers/change-password', data),

  resetPassword: (email: string) => GET(`/customers/reset-password/${email}`),

  confirmResetPassword: (data: ConfirmResetPassword) =>
    POST<ConfirmResetPassword, unknown>('/customers/reset-password', data),
};

export default customerApi;
