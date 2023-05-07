import httpProxy from 'http-proxy';
import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';

const proxy = httpProxy.createProxyServer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== 'POST') {
    return response.status(404).json({ message: 'Method not supported' });
  }
  const type = request.query?.type as string;
  if (!['admins', 'customers'].includes(type)) {
    return response.status(404).json({ message: 'Requested URL not found' });
  }
  request.headers.cookie = '';

  return new Promise<void>((resolve, reject) => {
    request.url = request.url?.replace(`auth/login/${type}`, `${type}/login`);
    request.headers['accept-encoding'] = '';

    proxy
      .once('proxyRes', (proxyRes, req, res) => {
        let body = '';
        proxyRes.on('data', (chunk) => {
          body += chunk;
        });

        proxyRes.on('end', () => {
          try {
            const { token, user, status } = JSON.parse(body);

            if (status === 400) {
              (res as NextApiResponse)
                .status(400)
                .send({ message: 'Tài khoản hoặc mật khẩu không đúng' });
            } else {
              const cookies = new Cookies(req, res);

              cookies.set('auth-token', token, {
                httpOnly: true,
                sameSite: 'lax', // CSRF protection
              });
              (res as NextApiResponse).status(200).json({ user });
            }
          } catch (err) {
            console.log('Login error: ', err);
            (res as NextApiResponse).status(500).send({ message: 'Sự cố máy chủ' });
          }
          resolve();
        });
      })
      .web(request, response, {
        target: process.env.HOST_API_URL,
        changeOrigin: true,
        selfHandleResponse: true,
      });
  });
};
