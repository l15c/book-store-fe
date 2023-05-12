import { IBook, IBookCompact, IBookCreate } from 'src/@types/book';
import { GET, POST, DELETE, PUT } from './axios';
import { Config, SearchPayload, ListResponse } from './type';

const bookApi = {
  getList: (data: SearchPayload, config?: Config) =>
    POST<SearchPayload, ListResponse<IBookCompact>>('/books/search', data, config),

  getSlugs: (config?: Config) => GET<string[]>('/books/slugs', config),

  getBySlug: (slug: string, config?: Config) => GET<IBook>(`/books/slugs/${slug}`, config),

  // HOMEPAGE
  related: (bookId: string, config?: Config) =>
    GET<IBookCompact[]>(`/books/related?id=${bookId}`, config),
  bestSeller: (config?: Config) => GET<IBookCompact[]>('/books/best-seller', config),
  bestDiscount: (config?: Config) => GET<IBookCompact[]>('/books/best-discount', config),
  newest: (config?: Config) => GET<IBookCompact[]>('/books/newest', config),
  upComing: (config?: Config) => GET<IBookCompact[]>('/books/up-coming', config),
  random: (config?: Config) => GET<IBookCompact[]>('/books/random', config),

  // ADMIN
  add: (data: IBookCreate) => POST<IBookCreate, IBook>('/books', data),
  update: (data: IBookCreate & { id: number }) =>
    PUT<IBookCreate & { id: number }, IBook>('/books', data),

  delete: (id: string) => DELETE(`/books/${id}`),
};

export default bookApi;
