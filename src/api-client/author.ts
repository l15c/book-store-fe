import { IAuthor } from '../@types/book';
import { GET, POST, PUT, DELETE } from './axios';
import { Create } from './type';

const authorApi = {
  getList: () => GET<IAuthor[]>('/authors'),
  create: (data: Create<IAuthor>) => POST<Create<IAuthor>, IAuthor>('/authors', data),
  read: (id: number) => GET<IAuthor>(`/authors/${id}`),
  update: (data: IAuthor) => PUT<IAuthor, IAuthor>('/authors', data),
  delete: (id: number) => DELETE(`/authors/${id}`),
};

export default authorApi;
