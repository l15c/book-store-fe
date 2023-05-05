function genUrl(link: string, prefix: string) {
  return link.includes('http') ? link : `/api/cld/image/${prefix}/${link}`;
}
export function getLinkImage(data: string | string[], prefix: string) {
  if (typeof data === 'string') return genUrl(data, prefix);
  return data.map((e) => genUrl(e, prefix));
}
