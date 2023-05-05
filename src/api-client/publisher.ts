import { IPublisher } from 'src/@types/book';
import { GET, POST, PUT, DELETE } from './axios';
import { Create } from './type';

const publisherApi = {
  getList: () => GET<IPublisher[]>('/publishers'),
  create: (data: Create<IPublisher>) => POST<Create<IPublisher>, IPublisher>('/publishers', data),
  read: (id: number) => GET<IPublisher>(`/publishers${id}`),
  update: (data: IPublisher) => PUT<IPublisher, IPublisher>('/publishers', data),
  delete: (id: number) => DELETE(`/publishers/${id}`),
};

export default publisherApi;
