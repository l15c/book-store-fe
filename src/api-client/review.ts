import { IReview } from 'src/@types/book';
import { GET, POST } from './axios';
import { Config, Create } from './type';

const reviewApi = {
  getBySlug: (slug: string, config?: Config) => GET<IReview[]>(`/reviews/${slug}`, config),
  create: (data: Create<IReview>) => POST('/reviews', data),
};

export default reviewApi;
