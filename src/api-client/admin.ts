import { IAuthUser } from 'src/@types/user';
import { GET, POST, PUT, DELETE } from './axios';

import { LoginPayload, AuthResponse, Create } from './type';

const adminApi = {
  login: (data: LoginPayload) => POST<LoginPayload, AuthResponse>('/auth/login/admins', data),

  // changePassword: () => POST('/admins/change-password'),

  addEmployee: (data: Create<IAuthUser>) => POST<Create<IAuthUser>, IAuthUser>('/admins', data),

  getEmployee: (id: string) => GET<IAuthUser>(`/admin/${id}`),

  updateEmployee: (data: IAuthUser) => PUT<IAuthUser, IAuthUser>('/admins', data),

  deleteEmployee: (id: string) => DELETE(`/admins/${id}`),
};

export default adminApi;
