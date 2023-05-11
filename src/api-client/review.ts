import { IReview } from 'src/@types/book';
import { GET, POST } from './axios';
import { Config } from './type';

const reviewApi = {
  getBySlug: (id: string, config?: Config) => GET<IReview[]>(`/reviews/${id}`, config),
  create: (data: { comment: string; rating: number; bookId: number }) => POST('/reviews', data),
};

export default reviewApi;
