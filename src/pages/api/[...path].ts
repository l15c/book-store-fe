import httpProxy from 'http-proxy';
import Cookies from 'cookies';
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
    const cookies = new Cookies(req, res);

    const accessToken = cookies.get('auth-token');
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }

    req.headers.cookie = '';

    proxy.web(req, res, {
      target: process.env.HOST_API_URL,
      changeOrigin: true,
    });

    proxy.once('proxyRes', () => {
      resolve();
    });
  });
