import { NextApiRequest, NextApiResponse } from 'next';
import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  new Promise((resolve) => {
    req.headers.cookie = '';

    req.url = req.url?.replace('api/cld', `${process.env.CLOUDINARY_CLOUD_NAME}`);

    proxy.web(req, res, {
      target: process.env.CLOUDINARY_HOST_API,
      changeOrigin: true,
    });

    proxy.once('proxyRes', () => {
      resolve(true);
    });
  });
