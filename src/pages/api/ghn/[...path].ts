import httpProxy from 'http-proxy';
import { NextApiRequest, NextApiResponse } from 'next';

const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  new Promise<void>((resolve) => {
    req.url = req.url?.replace('/api/ghn', '/shiip/public-api');
    req.headers.cookie = '';
    req.headers.Token = process.env.GHN_API_TOKEN;
    if (req.url?.includes('order')) req.headers.ShopId = process.env.GHN_BOOK_STORE_SHOP_ID;

    proxy.web(req, res, {
      target: 'https://dev-online-gateway.ghn.vn',
      changeOrigin: true,
    });

    proxy.once('proxyRes', () => {
      resolve();
    });
  });
