function genUrl(link: string, prefix?: string) {
  return link.includes('http') ? link : `/api/cld/image${prefix && `/${prefix}`}/${link}`;
}

export const getUrlImage = {
  product: (data: string, slug: string) => genUrl(data, `products/${slug}`),
  products: (data: string[], slug: string) => data.map((e) => genUrl(e, `products/${slug}`)),

  avatar: (avatarUrl?: string) =>
    avatarUrl ? genUrl(avatarUrl, 'users') : '/assets/avatar_default.jpg',

  array: (data: string[], prefix?: string) => data.map((e) => genUrl(e, prefix)),
  single: (data: string, prefix?: string) => genUrl(data, prefix),
};
