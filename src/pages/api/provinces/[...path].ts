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
  new Promise((resolve) => {
    req.url = req.url?.replace('/provinces', '/');
    req.headers.cookie = '';

    proxy.web(req, res, {
      target: 'https://provinces.open-api.vn',
      changeOrigin: true,
    });

    proxy.once('proxyRes', () => {
      resolve(true);
    });
  });
