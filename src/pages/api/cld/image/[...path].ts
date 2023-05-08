import httpProxy from 'http-proxy';
import { NextApiRequest, NextApiResponse } from 'next';

const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

const CLOUDINARY_RESOURCES_URL = 'https://res.cloudinary.com';

export default (req: NextApiRequest, res: NextApiResponse) =>
  new Promise<void>((resolve) => {
    // req.headers.cookie = '';

    req.url = req.url?.replace(
      'api/cld/image',
      `${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`
    );

    proxy.web(req, res, {
      target: CLOUDINARY_RESOURCES_URL,
      changeOrigin: true,
      secure: true,
    });

    proxy.once('proxyRes', () => {
      resolve();
    });
  });
