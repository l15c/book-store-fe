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

    req.url = req.url?.replace('api/cld/upload', `${process.env.CLOUDINARY_CLOUD_NAME}/upload`);

    proxy.web(req, res, {
      target: process.env.CLOUDINARY_HOST_API,
      changeOrigin: true,
    });

    proxy.once('proxyRes', () => {
      resolve(true);
    });
  });
