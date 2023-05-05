//
import { useMutation, useQuery } from '@tanstack/react-query';
// @types
import { IAuthor, IPublisher, IGenre } from 'src/@types/book';

// api
import authorApi from '../../api-client/author';
import genresApi from '../../api-client/genre';
import publisherApi from '../../api-client/publisher';

export default function useData(enabled: boolean = true) {
  const commonOptions = { staleTime: Infinity, enabled };

  // -------------------------------- QUERIES --------------------------------

  const authorQuery = useQuery({
    queryKey: ['author', 'all'],
    queryFn: () => authorApi.getList(),
    ...commonOptions,
  });

  const genreQuery = useQuery({
    queryKey: ['genre', 'all'],
    queryFn: () => genresApi.getList(),
    ...commonOptions,
  });

  const publisherQuery = useQuery({
    queryKey: ['publisher', 'all'],
    queryFn: () => publisherApi.getList(),
    ...commonOptions,
  });

  const queries = [authorQuery, genreQuery, publisherQuery];

  // -------------------------------- MUTATION --------------------------------

  const authorCreate = useMutation({
    mutationKey: ['author', 'create'],
    mutationFn: (data: Omit<IAuthor, 'id'>) => authorApi.create(data),
  });

  const authorUpdate = useMutation({
    mutationKey: ['author', 'update'],
    mutationFn: (data: IAuthor) => authorApi.update(data),
  });

  const genreCreate = useMutation({
    mutationKey: ['genre', 'create'],
    mutationFn: (data: Omit<IGenre, 'id'>) => genresApi.create(data),
  });

  const genreUpdate = useMutation({
    mutationKey: ['genre', 'update'],
    mutationFn: (data: IGenre) => genresApi.update(data),
  });

  const publisherCreate = useMutation({
    mutationKey: ['publisher', 'create'],
    mutationFn: (data: Omit<IPublisher, 'id'>) => publisherApi.create(data),
  });

  const publisherUpdate = useMutation({
    mutationKey: ['publisher', 'update'],
    mutationFn: (data: IPublisher) => publisherApi.update(data),
  });

  return {
    query: {
      authorQuery,
      genreQuery,
      publisherQuery,
      queries,
    },

    mutation: {
      author: { create: authorCreate, update: authorUpdate },
      genre: { create: genreCreate, update: genreUpdate },
      publisher: { create: publisherCreate, update: publisherUpdate },
    },
  };
}
