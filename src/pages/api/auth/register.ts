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

  request.headers.cookie = '';

  return new Promise((resolve, reject) => {
    request.url = request.url?.replace(`auth/register`, 'customers');
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
                .send({ message: 'Số điện thoại hoặc email đã đăng ký' });
            } else {
              const cookies = new Cookies(req, res);

              cookies.set('auth-token', token, {
                httpOnly: true,
                sameSite: 'lax', // CSRF protection
              });
              (res as NextApiResponse).status(200).json({ user });
            }
          } catch (err) {
            console.log('Register error: ', err);
            (res as NextApiResponse).status(500).send({ message: 'Sự cố máy chủ' });
          }
          resolve(true);
        });
      })
      .web(request, response, {
        target: process.env.HOST_API_URL,
        changeOrigin: true,
        selfHandleResponse: true,
      });
  });
};
