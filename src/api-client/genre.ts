import { IGenre } from 'src/@types/book';
import { GET, POST, PUT, DELETE } from './axios';
import { Create } from './type';

const genresApi = {
  getList: () => GET<IGenre[]>('/genres'),
  create: (data: Create<IGenre>) => POST<Create<IGenre>, IGenre>('/genres', data),
  read: (id: number) => GET<IGenre>(`/genres${id}`),
  update: (data: IGenre) => PUT<IGenre, IGenre>('/genres', data),
  delete: (id: number) => DELETE(`/genres/${id}`),
};

export default genresApi;
