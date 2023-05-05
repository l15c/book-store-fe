import { IUserAddress } from './user';

export type IAuthor = {
  id: number;
  name: string;
  description?: string;
};

export type IGenre = {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  parentId: number;
};

export type IPublisher = {
  id: number;
  name: string;
  description?: string;
  image: string;
};

export type IBook = {
  id: number;
  name: string;
  slug: string;
  cover: string;
  price: number;
  discount: number;
  quantity: number;
  images: string[];
  releaseDate: string;
  sold: number;
  saleStartDate?: string;
  saleEndDate?: string;
  saleQuantity: number;
  saleSold: number;

  description?: string;
  publishedYear: number;
  author: IAuthor;
  genre: IGenre;
  publisher: IPublisher;
  review: unknown[];
};

export type IBookCreate = {
  name: string;
  description?: string;
  slug?: string;
  cover: string;
  images: string[];
  price: number;
  discount: number;
  quantity: number;
  publishedYear: number;
  authorId: number;
  genreId: number;
  publisherId: number;
  releaseDate?: string;
};

export type IBookCompact = Omit<
  IBook,
  'description' | 'author' | 'genre' | 'publisher' | 'publishedYear' | 'review'
>;

// ----------------------------------------------------------------------

export type ICartItem = IBookCompact & {
  available: number;
};

export type ICheckoutState = {
  activeStep: number;
  billing: IUserAddress | null;
  discount: number;
  shipping: number;
};

export type ICartState = {
  products: ICartItem[];
  total: number;
  totalItems: number;
};

// ----------------------------------------------------------------------

export type IProductFilter = {
  authors: number[];
  genres: number[];
  priceRange: [number, number];
  publishers: number[];
  sortBy: string;
  sortDirection: 'asc' | 'desc';
};
